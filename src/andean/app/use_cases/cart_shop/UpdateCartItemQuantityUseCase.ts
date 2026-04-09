import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
	ForbiddenException,
} from '@nestjs/common';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { ProductType } from '../../../domain/enums/ProductType';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { CartItemQuantityResponse } from '../../models/cart/CartItemQuantityResponse';
import { BoxCartAvailabilityService } from '../../../infra/services/cart/BoxCartAvailabilityService';

@Injectable()
export class UpdateCartItemQuantityUseCase {
	constructor(
		@Inject(CartShopItemRepository)
		private readonly cartItemRepository: CartShopItemRepository,
		@Inject(CartShopRepository)
		private readonly cartShopRepository: CartShopRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		private readonly boxCartAvailability: BoxCartAvailabilityService,
	) {}

	async handle(
		idShoppingCartItem: string,
		quantityDelta: number = 1,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<CartItemQuantityResponse> {
		// -- Validate that the CartItem exists (always, for 404 check)
		const cartItem = await this.cartItemRepository.getById(idShoppingCartItem);
		if (!cartItem) {
			throw new NotFoundException('CartItem not found');
		}

		// -- Pattern H 3-hop ownership block (non-ADMIN only; reuses cartItem from above)
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			const customer =
				await this.customerRepository.getCustomerByUserId(requestingUserId);
			if (!customer) {
				throw new ForbiddenException('You can only access your own cart');
			}
			const cartShop = await this.cartShopRepository.getCartById(
				cartItem.cartShopId,
			);
			if (!cartShop) {
				throw new NotFoundException('CartShop not found');
			}
			if (cartShop.customerId !== customer.id) {
				throw new ForbiddenException('You can only access your own cart');
			}
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
			} else if (cartItem.productType === ProductType.BOX) {
				maxStock = await this.boxCartAvailability.maxSellableForBoxId(
					cartItem.productId,
				);
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
