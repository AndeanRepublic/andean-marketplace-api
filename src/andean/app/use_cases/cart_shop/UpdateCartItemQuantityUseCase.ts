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
import { CartItemQuantityResponse } from '../../modules/cart/CartItemQuantityResponse';

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
		// -- Validate that the CartItem exists
		const cartItem = await this.cartItemRepository.getById(idShoppingCartItem);
		if (!cartItem) {
			throw new NotFoundException('CartItem not found');
		}

		// -- Get maxStock
		let maxStock: number;

		if (cartItem.variantProductId) {
			const variant = await this.variantRepository.getById(
				cartItem.variantProductId,
			);
			if (!variant) {
				throw new NotFoundException('Variant not found');
			}
			maxStock = variant.stock;
		} else {
			if (cartItem.productType === ProductType.TEXTILE) {
				const product =
					await this.textileProductRepository.getTextileProductById(
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

		// -- Validate that the resulting quantity is not negative before updating
		const newQuantity = cartItem.quantity + quantityDelta;
		if (newQuantity <= 0) {
			throw new BadRequestException(
				'Quantity cannot be less than 1. The requested quantity delta would result in a quantity less than 1.',
			);
		}
		if (newQuantity > maxStock) {
			throw new BadRequestException(
				'Quantity cannot be greater than the maximum stock. The requested quantity delta would result in a quantity greater than the maximum stock.',
			);
		}

		// -- Update quantity
		const updatedCartItem = await this.cartItemRepository.updateQuantity(
			idShoppingCartItem,
			quantityDelta,
		);

		return {
			quantity: updatedCartItem.quantity,
			idShoppingCartItem: updatedCartItem.id,
			maxStock: maxStock,
		};
	}
}
