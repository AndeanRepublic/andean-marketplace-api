import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { ProductType } from '../../../domain/enums/ProductType';
import { CartItemQuantityResponse } from '../../models/cart/CartItemQuantityResponse';

@Injectable()
export class UpdateCartItemQuantityUseCase {
	constructor(
		@Inject(CartShopItemRepository)
		private readonly cartItemRepository: CartShopItemRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
	) {}

	async handle(
		idShoppingCartItem: string,
		quantityDelta: number = 1,
	): Promise<CartItemQuantityResponse> {
		// 1. Validar que el CartItem existe
		const cartItem = await this.cartItemRepository.getById(idShoppingCartItem);
		if (!cartItem) {
			throw new NotFoundException('CartItem not found');
		}

		// 2. Obtener maxStock
		let maxStock: number;

		if (cartItem.variantProductId) {
			// Si tiene variante, obtener stock de la variante
			const variant = await this.variantRepository.getById(
				cartItem.variantProductId,
			);
			if (!variant) {
				throw new NotFoundException('Variant not found');
			}
			maxStock = variant.stock;
		} else {
			// Si no tiene variante, obtener stock del producto según productType
			if (cartItem.productType === ProductType.TEXTILE) {
				const product = await this.textileProductRepository.getTextileProductById(
					cartItem.productId,
				);
				if (!product) {
					throw new NotFoundException('TextileProduct not found');
				}
				maxStock = product.priceInventary.totalStock;
			} else if (cartItem.productType === ProductType.SUPERFOOD) {
				const product =
					await this.superfoodProductRepository.getSuperfoodProductById(
						cartItem.productId,
					);
				if (!product) {
					throw new NotFoundException('SuperfoodProduct not found');
				}
				maxStock = product.priceInventory.totalStock;
			} else {
				throw new BadRequestException(
					`ProductType ${cartItem.productType} is not supported for stock retrieval`,
				);
			}
		}

		// 3. Validar que la cantidad resultante no sea negativa antes de actualizar
		const newQuantity = cartItem.quantity + quantityDelta;
		if (newQuantity < 0) {
			throw new BadRequestException(
				'Quantity cannot be negative. The requested quantity delta would result in a negative quantity.',
			);
		}

		// 4. Actualizar cantidad
		const updatedCartItem = await this.cartItemRepository.updateQuantity(
			idShoppingCartItem,
			quantityDelta,
		);

		// 5. Retornar response
		return {
			quantity: updatedCartItem.quantity,
			idShoppingCartItem: updatedCartItem.id,
			maxStock: maxStock,
		};
	}
}
