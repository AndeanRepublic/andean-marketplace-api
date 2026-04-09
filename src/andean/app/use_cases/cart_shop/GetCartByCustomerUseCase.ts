import {
	Inject,
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { CartShop } from '../../../domain/entities/CartShop';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { Types } from 'mongoose';
import { GetCartResponse } from '../../models/cart/GetCartResponse';
import { ShoppingCartItemResponse } from '../../models/cart/ShoppingCartItemResponse';
import { ProductInfoProviderRegistry } from '../../../infra/services/products/ProductInfoProviderRegistry';
import { OwnerNameResolver } from '../../../infra/services/OwnerNameResolver';
import { CartItem } from '../../../domain/entities/CartItem';
import { ShoppingCartItemMapper } from '../../../infra/services/cart/ShoppingCartItemMapper';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxCartContentResolver } from '../../../infra/services/cart/BoxCartContentResolver';
import { BoxCartAvailabilityService } from '../../../infra/services/cart/BoxCartAvailabilityService';
import { TextileProductAttributesAssembler } from '../../../infra/services/textileProducts/TextileProductAttributesAssembler';
import { CartColorOptionResponse } from '../../models/cart/CartColorOptionResponse';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';

@Injectable()
export class GetCartByCustomerUseCase {
	constructor(
		@Inject(CartShopRepository)
		private readonly cartShopRepository: CartShopRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
		@Inject(CartShopItemRepository)
		private readonly cartItemRepository: CartShopItemRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		private readonly productInfoRegistry: ProductInfoProviderRegistry,
		private readonly ownerNameResolver: OwnerNameResolver,
		private readonly boxCartContentResolver: BoxCartContentResolver,
		private readonly boxCartAvailability: BoxCartAvailabilityService,
		private readonly textileProductAttributesAssembler: TextileProductAttributesAssembler,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
	) {}

	async handle(
		requestingUserId: string,
		roles: AccountRole[],
		targetCustomerId?: string,
	): Promise<GetCartResponse> {
		// Pattern H — 2-hop ownership check with ADMIN bypass
		let customerId: string | null;
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (isAdmin && targetCustomerId) {
			// ADMIN targeting a specific customer's cart
			customerId = targetCustomerId;
		} else if (!isAdmin) {
			const customer =
				await this.customerRepository.getCustomerByUserId(requestingUserId);
			if (!customer) {
				throw new ForbiddenException('You can only access your own cart');
			}
			customerId = customer.id;
		} else {
			// ADMIN with no targetCustomerId: resolve own customer profile
			const customer =
				await this.customerRepository.getCustomerByUserId(requestingUserId);
			customerId = customer?.id ?? null;
		}

		// ADMIN with no CustomerProfile: return empty cart immediately
		if (!customerId) {
			return {
				items: [],
				delivery: 0,
				discount: 0,
				taxOrFee: 0,
			};
		}

		// 3. Obtener o crear el carrito
		let cart = await this.cartShopRepository.getCartByCustomerId(customerId);
		if (!cart) {
			cart = new CartShop(
				new Types.ObjectId().toString(),
				customerId,
				0, // delivery
				0, // tax
				0, // discount
				new Date(),
				new Date(),
				undefined,
			);
			await this.cartShopRepository.createCart(cart);

			// Carrito nuevo, devolver vacío
			return {
				items: [],
				delivery: 0,
				discount: 0,
				taxOrFee: 0,
			};
		}

		// 3. Obtener los items del carrito
		const cartItems = await this.cartItemRepository.getItemsByCartShopId(
			cart.id,
		);

		const boxMaxStockById = new Map<string, number>();
		const enrichedItems = await Promise.all(
			cartItems.map((item) => this.enrichCartItem(item, boxMaxStockById)),
		);

		// 5. Construir y retornar la respuesta
		return {
			items: enrichedItems,
			delivery: cart.deliveryCost,
			discount: cart.discount,
			taxOrFee: cart.taxOrFee,
		};
	}

	/**
	 * Enriquece un item del carrito con información del producto y variante.
	 * Para items de tipo BOX, usa un flujo especial sin variante ni ownerName.
	 */
	private async enrichCartItem(
		item: CartItem,
		boxMaxStockById: Map<string, number>,
	): Promise<ShoppingCartItemResponse> {
		const productInfo = await this.productInfoRegistry.getProductInfo(
			item.productType,
			item.productId,
		);

		if (item.productType === ProductType.BOX) {
			let maxStock = boxMaxStockById.get(item.productId);
			if (maxStock === undefined) {
				try {
					maxStock = await this.boxCartAvailability.maxSellableForBoxId(
						item.productId,
					);
				} catch (err) {
					if (!(err instanceof NotFoundException)) {
						throw err;
					}
					maxStock = 0;
				}
				boxMaxStockById.set(item.productId, maxStock);
			}
			const boxContent = await this.boxCartContentResolver.resolve(
				item.productId,
			);
			return ShoppingCartItemMapper.toBoxResponse(
				item,
				productInfo,
				boxContent,
				maxStock,
			);
		}

		// Flujo estándar para TEXTILE/SUPERFOOD
		const variant = item.variantProductId
			? await this.variantRepository.getById(item.variantProductId)
			: null;

		const ownerName = await this.ownerNameResolver.resolve(
			productInfo.ownerType,
			productInfo.ownerId,
		);

		let colorOption: CartColorOptionResponse | undefined;
		if (item.productType === ProductType.TEXTILE && variant) {
			const textileProduct =
				await this.textileProductRepository.getTextileProductById(item.productId);
			if (textileProduct) {
				const resolved =
					await this.textileProductAttributesAssembler.resolveColorOptionForProductAndVariant(
						textileProduct,
						variant,
					);
				if (resolved) {
					colorOption = {
						label: resolved.label,
						hexCode: resolved.hexCode,
					};
				}
			}
		}

		return ShoppingCartItemMapper.toResponse(
			item,
			variant,
			productInfo,
			ownerName,
			colorOption,
		);
	}
}
