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
import { ProductType } from '../../../domain/enums/ProductType';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { SuperfoodOwnerType } from '../../../domain/enums/SuperfoodOwnerType';

interface ProductInfo {
	title: string;
	thumbnailImgUrl: string;
	ownerType: OwnerType | SuperfoodOwnerType;
	ownerId: string;
	isDiscountActive: boolean;
}

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
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerRepository: SellerProfileRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
	) {}

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

		// 3. Obtener información del producto según el tipo
		const productInfo = await this.getProductInfo(
			variant.productId,
			variant.productType,
		);

		// 4. Obtener el nombre del owner (shop o community)
		const ownerName = await this.getOwnerName(
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

	/**
	 * Obtiene la información del producto según su tipo
	 */
	private async getProductInfo(
		productId: string,
		productType: ProductType,
	): Promise<ProductInfo> {
		switch (productType) {
			case ProductType.TEXTILE: {
				const textileProduct =
					await this.textileProductRepository.getTextileProductById(productId);
				if (!textileProduct) {
					throw new NotFoundException('Textile product not found');
				}
				return {
					title: textileProduct.baseInfo.title,
					thumbnailImgUrl: textileProduct.baseInfo.media[0] || '',
					ownerType: textileProduct.baseInfo.ownerType,
					ownerId: textileProduct.baseInfo.ownerId,
					isDiscountActive: textileProduct.isDiscountActive,
				};
			}
			case ProductType.SUPERFOOD: {
				const superfoodProduct =
					await this.superfoodProductRepository.getSuperfoodProductById(
						productId,
					);
				if (!superfoodProduct) {
					throw new NotFoundException('Superfood product not found');
				}
				return {
					title: superfoodProduct.baseInfo.title,
					thumbnailImgUrl: superfoodProduct.baseInfo.mediaIds[0] || '',
					ownerType: superfoodProduct.baseInfo.ownerType,
					ownerId: superfoodProduct.baseInfo.ownerId,
					isDiscountActive: superfoodProduct.isDiscountActive,
				};
			}
			case ProductType.EXPERIENCE:
				throw new NotFoundException(
					'Experience products are not yet supported',
				);
		}
	}

	/**
	 * Obtiene el nombre del propietario según su tipo
	 */
	private async getOwnerName(
		ownerType: OwnerType | SuperfoodOwnerType,
		ownerId: string,
	): Promise<string> {
		// Comparamos con el valor string ya que ambos enums tienen los mismos valores
		const ownerTypeValue = ownerType as string;
		if (ownerTypeValue === 'SHOP') {
			const seller = await this.sellerRepository.getSellerById(ownerId);
			return seller?.commercialName || 'Vendedor desconocido';
		} else if (ownerTypeValue === 'COMMUNITY') {
			const community = await this.communityRepository.getById(ownerId);
			return community?.name || 'Comunidad desconocida';
		}
		return 'Propietario desconocido';
	}
}
