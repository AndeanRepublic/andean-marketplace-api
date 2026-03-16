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
import { DiscountCodeService } from '../../../infra/services/DiscountCodeService';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { ApplyDiscountResponse } from '../../modules/cart/ApplyDiscountResponse';
import { CartItem } from '../../../domain/entities/CartItem';

@Injectable()
export class ApplyDiscountCodeUseCase {
	constructor(
		@Inject(CartShopItemRepository)
		private readonly cartItemRepository: CartShopItemRepository,
		@Inject(CartShopRepository)
		private readonly cartShopRepository: CartShopRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
		@Inject(DiscountCodeService)
		private readonly discountCodeService: DiscountCodeService,
	) {}

	async handle(
		cartItemId: string,
		code: string,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<ApplyDiscountResponse> {
		// Pattern H 3-hop ownership block — MUST run as FIRST action (spec: ownership before discount validation)
		const isAdmin = roles.includes(AccountRole.ADMIN);
		let cartItemForOwnership: CartItem | null = null;
		if (!isAdmin) {
			// Step 1: resolve caller's customer profile
			const customer =
				await this.customerRepository.getCustomerByUserId(requestingUserId);
			if (!customer) {
				throw new ForbiddenException('You can only access your own cart');
			}
			// Step 2: fetch cartItem (reuse below to avoid double fetch)
			cartItemForOwnership = await this.cartItemRepository.getById(cartItemId);
			if (!cartItemForOwnership) {
				throw new NotFoundException('CartItem not found');
			}
			// Step 3: resolve parent cart
			const cartShop = await this.cartShopRepository.getCartById(
				cartItemForOwnership.cartShopId,
			);
			if (!cartShop) {
				throw new NotFoundException('CartShop not found');
			}
			// Step 4: compare ownership
			if (cartShop.customerId !== customer.id) {
				throw new ForbiddenException('You can only access your own cart');
			}
		}

		// 1. Validar que el CartItem existe — reuse from ownership block for non-ADMIN
		const cartItem =
			cartItemForOwnership ??
			(await this.cartItemRepository.getById(cartItemId));
		if (!cartItem) {
			throw new NotFoundException('CartItem not found');
		}

		// 2. Obtener todos los CartItems del mismo cartShopId
		const allCartItems = await this.cartItemRepository.getItemsByCartShopId(
			cartItem.cartShopId,
		);

		// 3. Validar que ningún CartItem tenga discount > 0 (incluso el actual)
		const hasExistingDiscount = allCartItems.some((item) => item.discount > 0);

		if (hasExistingDiscount) {
			throw new BadRequestException(
				'No es posible aplicar el descuento. Ya existe un producto en el carrito con descuento aplicado.',
			);
		}

		// 4. Obtener el CartShop para obtener el customerId o customerEmail
		const cartShop = await this.cartShopRepository.getCartById(
			cartItem.cartShopId,
		);
		if (!cartShop) {
			throw new NotFoundException('CartShop not found');
		}

		// Validar que el carrito tenga un identificador válido
		if (!cartShop.customerId && !cartShop.customerEmail) {
			throw new BadRequestException(
				'CartShop must have either customerId or customerEmail',
			);
		}

		// 5. Validar el código con la API externa (solo si hay customerId)
		if (!cartShop.customerId) {
			throw new BadRequestException(
				'Discount codes can only be applied to carts with a registered customer',
			);
		}

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

		// 7. Calcular monto de descuento
		const discountAmount =
			cartItem.unitPrice * (validationResult.percentage / 100);

		// 8. Actualizar CartItem con el descuento
		const updatedCartItem = await this.cartItemRepository.updateDiscount(
			cartItemId,
			discountAmount,
		);

		// 9. Retornar response
		return {
			percentage: validationResult.percentage,
			discount: discountAmount,
			cartItemId: updatedCartItem.id,
		};
	}
}
