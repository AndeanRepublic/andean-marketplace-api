import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { CartShop } from '../../../domain/entities/CartShop';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { Types } from 'mongoose';
import { GetCartResponse } from '../../modules/cart/GetCartResponse';
import { ShoppingCartItemResponse } from '../../modules/cart/ShoppingCartItemResponse';
import { ProductInfoProviderRegistry } from '../../../infra/services/products/ProductInfoProviderRegistry';
import { OwnerNameResolver } from '../../../infra/services/OwnerNameResolver';
import { CartItem } from '../../../domain/entities/CartItem';
import { ShoppingCartItemMapper } from '../../../infra/services/cart/ShoppingCartItemMapper';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxCartContentResolver } from '../../../infra/services/cart/BoxCartContentResolver';

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
	) { }

	async handle(customerId: string): Promise<GetCartResponse> {
		// 1. Validar que customerId esté presente
		if (!customerId) {
			throw new NotFoundException('customerId must be provided');
		}

		// 2. Validar que el customer existe
		const customerFound =
			await this.customerRepository.getCustomerById(customerId);
		if (!customerFound) {
			throw new NotFoundException('CustomerProfile not found');
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

		// 4. Enriquecer cada item con información del producto
		const enrichedItems = await Promise.all(
			cartItems.map((item) => this.enrichCartItem(item)),
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
	): Promise<ShoppingCartItemResponse> {
		// Obtener información del producto
		const productInfo = await this.productInfoRegistry.getProductInfo(
			item.productType,
			item.productId,
		);

		// Flujo especial para BOX: sin variante, sin owner, con contenido de caja
		if (item.productType === ProductType.BOX) {
			const boxContent = await this.boxCartContentResolver.resolve(item.productId);
			return ShoppingCartItemMapper.toBoxResponse(item, productInfo, boxContent);
		}

		// Flujo estándar para TEXTILE/SUPERFOOD
		const variant = item.variantProductId
			? await this.variantRepository.getById(item.variantProductId)
			: null;

		const ownerName = await this.ownerNameResolver.resolve(
			productInfo.ownerType,
			productInfo.ownerId,
		);

		return ShoppingCartItemMapper.toResponse(item, variant, productInfo, ownerName);
	}
}
