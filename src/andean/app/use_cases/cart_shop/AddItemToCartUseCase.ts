import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { AddCartItemDto } from '../../../infra/controllers/dto/AddCartItemDto';
import { CartShop } from '../../../domain/entities/CartShop';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { CartItem } from '../../../domain/entities/CartItem';
import { Types } from 'mongoose';
import { ShoppingCartItemResponse } from '../../modules/cart/ShoppingCartItemResponse';
import { ProductInfoProviderRegistry } from '../../../infra/services/products/ProductInfoProviderRegistry';
import { OwnerNameResolver } from '../../../infra/services/OwnerNameResolver';
import { ShoppingCartItemMapper } from '../../../infra/services/cart/ShoppingCartItemMapper';

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
	): Promise<ShoppingCartItemResponse> {
		// 1. Validar que customerId esté presente
		if (!customerId) {
			throw new BadRequestException('customerId must be provided');
		}

		// 2. Validar que el customer existe
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

		// 2.1. Validar que la variante tenga stock disponible
		if (variant.stock <= 0) {
			throw new BadRequestException(
				'La variante seleccionada no tiene stock disponible',
			);
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
				undefined, // customerEmail - not used for logged-in users
			);
			await this.cartShopRepository.createCart(cart);
		}

		// Verificar si ya existe un item en el carrito con la misma variante
		const existingCartItems =
			await this.cartItemRepository.getItemsByCartShopId(cart.id);
		const existingItemWithSameVariant = existingCartItems.find(
			(item) => item.variantProductId === variant.id,
		);

		// Calcular la cantidad total que se intentaría agregar
		const totalQuantity = existingItemWithSameVariant
			? existingItemWithSameVariant.quantity + itemDto.quantity
			: itemDto.quantity;

		// Validar que la cantidad total no exceda el stock disponible
		if (totalQuantity > variant.stock) {
			const availableStock = variant.stock;
			const alreadyInCart = existingItemWithSameVariant
				? existingItemWithSameVariant.quantity
				: 0;
			const maxCanAdd = availableStock - alreadyInCart;

			throw new BadRequestException(
				`Stock insuficiente. Stock disponible: ${availableStock}, ` +
					`ya en carrito: ${alreadyInCart}, ` +
					`máximo que puedes agregar: ${maxCanAdd}`,
			);
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

		// 7. Usar mapper para construir la respuesta
		return ShoppingCartItemMapper.fromParams({
			cartItemId,
			variant,
			productInfo,
			ownerName,
			quantity: itemDto.quantity,
		});
	}
}
