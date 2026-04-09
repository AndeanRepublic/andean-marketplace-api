import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
	ForbiddenException,
} from '@nestjs/common';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { AddCartItemDto } from '../../../infra/controllers/dto/AddCartItemDto';
import { CartShop } from '../../../domain/entities/CartShop';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { CartItem } from '../../../domain/entities/CartItem';
import { Types } from 'mongoose';
import { ShoppingCartItemResponse } from '../../models/cart/ShoppingCartItemResponse';
import { ProductInfoProviderRegistry } from '../../../infra/services/products/ProductInfoProviderRegistry';
import { OwnerNameResolver } from '../../../infra/services/OwnerNameResolver';
import { ShoppingCartItemMapper } from '../../../infra/services/cart/ShoppingCartItemMapper';
import { TextileProductAttributesAssembler } from '../../../infra/services/textileProducts/TextileProductAttributesAssembler';
import { ProductType } from '../../../domain/enums/ProductType';
import { CartColorOptionResponse } from '../../models/cart/CartColorOptionResponse';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { BoxCartAvailabilityService } from '../../../infra/services/cart/BoxCartAvailabilityService';
import { BoxCartContentResolver } from '../../../infra/services/cart/BoxCartContentResolver';
import { Variant } from '../../../domain/entities/Variant';

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
		private readonly textileProductAttributesAssembler: TextileProductAttributesAssembler,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly boxCartAvailability: BoxCartAvailabilityService,
		private readonly boxCartContentResolver: BoxCartContentResolver,
	) {}

	async handle(
		requestingUserId: string,
		roles: AccountRole[],
		itemDto: AddCartItemDto,
		targetCustomerId?: string,
	): Promise<ShoppingCartItemResponse> {
		const customerId = await this.resolveCustomerId(
			requestingUserId,
			roles,
			targetCustomerId,
		);

		const variantIdTrim = itemDto.variantId?.trim();
		const boxIdTrim = itemDto.boxId?.trim();
		if (variantIdTrim && boxIdTrim) {
			throw new BadRequestException(
				'No envíe variantId y boxId en la misma petición',
			);
		}

		if (boxIdTrim) {
			return this.addBoxToCart(customerId, boxIdTrim, itemDto.quantity);
		}
		if (variantIdTrim) {
			return this.addVariantToCart(
				customerId,
				variantIdTrim,
				itemDto.quantity,
			);
		}
		throw new BadRequestException('Debe enviar variantId o boxId');
	}

	private async resolveCustomerId(
		requestingUserId: string,
		roles: AccountRole[],
		targetCustomerId?: string,
	): Promise<string> {
		let customerId: string | null;
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (isAdmin && targetCustomerId) {
			customerId = targetCustomerId;
		} else if (!isAdmin) {
			const customer =
				await this.customerRepository.getCustomerByUserId(requestingUserId);
			if (!customer) {
				throw new ForbiddenException('You can only access your own cart');
			}
			customerId = customer.id;
		} else {
			const customer =
				await this.customerRepository.getCustomerByUserId(requestingUserId);
			customerId = customer?.id ?? null;
		}

		if (!customerId) {
			throw new ForbiddenException('You can only access your own cart');
		}
		return customerId;
	}

	private async ensureCart(customerId: string): Promise<CartShop> {
		let cart = await this.cartShopRepository.getCartByCustomerId(customerId);
		if (!cart) {
			cart = new CartShop(
				new Types.ObjectId().toString(),
				customerId,
				0,
				0,
				0,
				new Date(),
				new Date(),
				undefined,
			);
			await this.cartShopRepository.createCart(cart);
		}
		return cart;
	}

	private async addVariantToCart(
		customerId: string,
		variantId: string,
		quantity: number,
	): Promise<ShoppingCartItemResponse> {
		const variant = await this.variantRepository.getById(variantId);
		if (!variant) {
			throw new NotFoundException('Variant not found');
		}

		if (variant.stock <= 0) {
			throw new BadRequestException(
				'La variante seleccionada no tiene stock disponible',
			);
		}

		const productInfo = await this.productInfoRegistry.getProductInfo(
			variant.productType,
			variant.productId,
		);

		const ownerName = await this.ownerNameResolver.resolve(
			productInfo.ownerType,
			productInfo.ownerId,
		);

		const colorOption = await this.resolveTextileColorOption(variant);

		const cart = await this.ensureCart(customerId);
		const existingCartItems =
			await this.cartItemRepository.getItemsByCartShopId(cart.id);
		const existingItemWithSameVariant = existingCartItems.find(
			(item) => item.variantProductId === variant.id,
		);

		const totalQuantity = existingItemWithSameVariant
			? existingItemWithSameVariant.quantity + quantity
			: quantity;

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

		if (existingItemWithSameVariant) {
			const updatedItem = await this.cartItemRepository.updateQuantity(
				existingItemWithSameVariant.id,
				quantity,
			);
			return ShoppingCartItemMapper.toResponse(
				updatedItem,
				variant,
				productInfo,
				ownerName,
				colorOption,
			);
		}

		const cartItemId = new Types.ObjectId().toString();
		const cartItem = new CartItem(
			cartItemId,
			cart.id,
			variant.productType,
			variant.productId,
			quantity,
			variant.price,
			0,
			new Date(),
			new Date(),
			variant.id,
		);
		await this.cartItemRepository.createItem(cartItem);

		return ShoppingCartItemMapper.fromParams({
			cartItemId,
			variant,
			productInfo,
			ownerName,
			quantity,
			colorOption,
		});
	}

	private async resolveTextileColorOption(
		variant: Variant,
	): Promise<CartColorOptionResponse | undefined> {
		if (variant.productType !== ProductType.TEXTILE) {
			return undefined;
		}
		const textileProduct =
			await this.textileProductRepository.getTextileProductById(
				variant.productId,
			);
		if (!textileProduct) {
			return undefined;
		}
		const resolved =
			await this.textileProductAttributesAssembler.resolveColorOptionForProductAndVariant(
				textileProduct,
				variant,
			);
		if (!resolved) {
			return undefined;
		}
		return { label: resolved.label, hexCode: resolved.hexCode };
	}

	private async addBoxToCart(
		customerId: string,
		boxId: string,
		quantity: number,
	): Promise<ShoppingCartItemResponse> {
		const { box, maxSellableBoxes } =
			await this.boxCartAvailability.requireSellableBox(boxId);

		const productInfo = await this.productInfoRegistry.getProductInfo(
			ProductType.BOX,
			box.id,
		);
		if (!productInfo) {
			throw new NotFoundException('Box product info not found');
		}

		const cart = await this.ensureCart(customerId);
		const existingCartItems =
			await this.cartItemRepository.getItemsByCartShopId(cart.id);
		const existingBoxLine = existingCartItems.find(
			(item) =>
				item.productType === ProductType.BOX &&
				item.productId === box.id &&
				!item.variantProductId,
		);

		const totalQuantity = existingBoxLine
			? existingBoxLine.quantity + quantity
			: quantity;

		if (totalQuantity > maxSellableBoxes) {
			const alreadyInCart = existingBoxLine ? existingBoxLine.quantity : 0;
			const maxCanAdd = maxSellableBoxes - alreadyInCart;
			throw new BadRequestException(
				`Stock insuficiente para la caja. Disponible: ${maxSellableBoxes}, ` +
					`ya en carrito: ${alreadyInCart}, máximo que puedes agregar: ${maxCanAdd}`,
			);
		}

		if (existingBoxLine) {
			const updatedItem = await this.cartItemRepository.updateQuantity(
				existingBoxLine.id,
				quantity,
			);
			const boxContent = await this.boxCartContentResolver.resolve(box.id);
			return ShoppingCartItemMapper.toBoxResponse(
				updatedItem,
				productInfo,
				boxContent,
				maxSellableBoxes,
			);
		}

		const cartItemId = new Types.ObjectId().toString();
		const cartItem = new CartItem(
			cartItemId,
			cart.id,
			ProductType.BOX,
			box.id,
			quantity,
			box.price,
			0,
			new Date(),
			new Date(),
			undefined,
		);
		await this.cartItemRepository.createItem(cartItem);

		const boxContent = await this.boxCartContentResolver.resolve(box.id);
		return ShoppingCartItemMapper.toBoxResponse(
			cartItem,
			productInfo,
			boxContent,
			maxSellableBoxes,
		);
	}
}
