import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { DiscountCodeService } from '../../../infra/services/DiscountCodeService';
import { ApplyDiscountResponse } from '../../models/cart/ApplyDiscountResponse';

@Injectable()
export class ApplyDiscountCodeUseCase {
	constructor(
		@Inject(CartShopItemRepository)
		private readonly cartItemRepository: CartShopItemRepository,
		@Inject(CartShopRepository)
		private readonly cartShopRepository: CartShopRepository,
		@Inject(DiscountCodeService)
		private readonly discountCodeService: DiscountCodeService,
	) {}

	async handle(
		cartItemId: string,
		code: string,
	): Promise<ApplyDiscountResponse> {
		// 1. Validar que el CartItem existe
		const cartItem = await this.cartItemRepository.getById(cartItemId);
		if (!cartItem) {
			throw new NotFoundException('CartItem not found');
		}

		// 2. Obtener todos los CartItems del mismo cartShopId
		const allCartItems = await this.cartItemRepository.getItemsByCartShopId(
			cartItem.cartShopId,
		);

		// 3. Validar que ningún CartItem tenga discount > 0 (incluso el actual)
		const hasExistingDiscount = allCartItems.some(
			(item) => item.discount > 0,
		);

		if (hasExistingDiscount) {
			throw new BadRequestException(
				'No es posible aplicar el descuento. Ya existe un producto en el carrito con descuento aplicado.',
			);
		}

		// 4. Obtener el CartShop para obtener el customerId
		const cartShop = await this.cartShopRepository.getCartById(
			cartItem.cartShopId,
		);
		if (!cartShop) {
			throw new NotFoundException('CartShop not found');
		}

		// 5. Validar el código con la API externa
		const validationResult =
			await this.discountCodeService.validateDiscountCode(
				code,
				cartShop.customerId,
			);

		if (!validationResult.isValid) {
			throw new BadRequestException('Código de descuento inválido');
		}

		if (!validationResult.percentage) {
			throw new BadRequestException(
				'El código de descuento no proporciona un porcentaje válido',
			);
		}

		// 6. Calcular monto de descuento
		const discountAmount =
			cartItem.unitPrice * (validationResult.percentage / 100);

		// 7. Actualizar CartItem con el descuento
		const updatedCartItem = await this.cartItemRepository.updateDiscount(
			cartItemId,
			discountAmount,
		);

		// 8. Retornar response
		return {
			percentage: validationResult.percentage,
			discount: discountAmount,
			cartItemId: updatedCartItem.id,
		};
	}
}
