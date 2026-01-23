import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { AddCartItemDto } from '../../../infra/controllers/dto/AddCartItemDto';
import { CartShop } from '../../../domain/entities/CartShop';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { CartItem } from '../../../domain/entities/CartItem';
import { Types } from 'mongoose';
import { AddCartItemResponse } from '../../models/AddCartItemResponse';
import { ProductInfoProviderRegistry } from '../../../infra/services/products/ProductInfoProviderRegistry';
import { OwnerNameResolver } from '../../../infra/services/OwnerNameResolver';

@Injectable()
export class AddItemToCartUseCase {
	constructor(
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(CartShopRepository)
		private readonly cartShopRepository: CartShopRepository,
		@Inject(CartShopItemRepository)
		private readonly cartItemRepository: CartShopItemRepository,
		private readonly productInfoRegistry: ProductInfoProviderRegistry,
		private readonly ownerNameResolver: OwnerNameResolver,
	) { }

	async handle(
		customerId: string,
		itemDto: AddCartItemDto,
	): Promise<AddCartItemResponse> {
		// 1. Validar que el customer existe
		const customerFound =
			await this.customerRepository.getCustomerById(customerId);
		if (!customerFound) {
			throw new NotFoundException('CustomerProfile not found');
		}

		// 2. Obtener la variante
		const variant = await this.variantRepository.getById(itemDto.variantId);
		if (!variant) {
			throw new NotFoundException('Variant not found');
		}

		// 3. Obtener información del producto según el tipo (Strategy Pattern)
		const productInfo = await this.productInfoRegistry.getProductInfo(
			variant.productType,
			variant.productId,
		);

		// 4. Obtener el nombre del owner (shop o community)
		const ownerName = await this.ownerNameResolver.resolve(
			productInfo.ownerType,
			productInfo.ownerId,
		);

		// 5. Obtener o crear el carrito del customer
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
		}

		// 6. Crear el item del carrito
		const cartItemId = new Types.ObjectId().toString();
		const cartItem = new CartItem(
			cartItemId,
			cart.id,
			variant.productType,
			variant.productId,
			itemDto.quantity,
			variant.price,
			0, // discount
			new Date(),
			new Date(),
			variant.id,
		);
		await this.cartItemRepository.createItem(cartItem);

		// 7. Construir y retornar la respuesta
		return {
			ownerName,
			titulo: productInfo.title,
			combinationVariant: variant.combination,
			thumbnailImgUrl: productInfo.thumbnailImgUrl,
			unitPrice: variant.price,
			quantity: itemDto.quantity,
			idShoppingCartItem: cartItemId,
			maxStock: variant.stock,
			isDiscountActive: productInfo.isDiscountActive,
		};
	}
}
