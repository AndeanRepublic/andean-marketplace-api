import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
	) {}

	async handle(customerId: string): Promise<GetCartResponse> {
		// 1. Validar que el customer existe
		const customerFound =
			await this.customerRepository.getCustomerById(customerId);
		if (!customerFound) {
			throw new NotFoundException('CustomerProfile not found');
		}

		// 2. Obtener o crear el carrito
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
	 */
	private async enrichCartItem(
		item: CartItem,
	): Promise<ShoppingCartItemResponse> {
		// Obtener variante para combination y stock
		const variant = item.variantProductId
			? await this.variantRepository.getById(item.variantProductId)
			: null;

		// Obtener información del producto
		const productInfo = await this.productInfoRegistry.getProductInfo(
			item.productType,
			item.productId,
		);

		// Obtener nombre del owner
		const ownerName = await this.ownerNameResolver.resolve(
			productInfo.ownerType,
			productInfo.ownerId,
		);

		return {
			ownerName,
			titulo: productInfo.title,
			combinationVariant: variant?.combination || {},
			thumbnailImgUrl: productInfo.thumbnailImgUrl,
			unitPrice: item.unitPrice,
			quantity: item.quantity,
			idShoppingCartItem: item.id,
			maxStock: variant?.stock || 0,
			isDiscountActive: productInfo.isDiscountActive,
		};
	}
}
