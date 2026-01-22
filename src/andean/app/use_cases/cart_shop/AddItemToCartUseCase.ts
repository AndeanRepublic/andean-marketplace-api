import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { ProductRepository } from '../../datastore/Product.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { AddCartItemDto } from '../../../infra/controllers/dto/AddCartItemDto';
import { CartShop } from '../../../domain/entities/CartShop';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { ProductVariantRepository } from '../../datastore/ProductVariant.repo';
import { CartItem } from '../../../domain/entities/CartItem';
import { Types } from 'mongoose';

@Injectable()
export class AddItemToCartUseCase {
  constructor(
    @Inject(CustomerProfileRepository)
    private readonly customerRepository: CustomerProfileRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
    @Inject(ProductVariantRepository)
    private readonly variantRepository: ProductVariantRepository,
    @Inject(CartShopRepository)
    private readonly cartShopRepository: CartShopRepository,
    @Inject(CartShopItemRepository)
    private readonly cartItemRepository: CartShopItemRepository,
  ) {}

  async handle(customerId: string, itemDto: AddCartItemDto): Promise<CartShop> {
    const customerFound = await this.customerRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('CustomerProfile not found');
    }
    const productFound = await this.productRepository.getProductById(
      itemDto.productId,
    );
    if (!productFound) {
      throw new NotFoundException('Product not found');
    }
    let cartFound = await this.cartShopRepository.getCartByCustomerId(customerId);
    if (!cartFound) {
      cartFound = new CartShop(
        new Types.ObjectId().toString(),
        customerId,
        0,
        0,
        0,
        new Date(),
        new Date(),
      );
      await this.cartShopRepository.createCart(cartFound);
    }
    let unitPrice = productFound.basePrice;
    if (itemDto.productVariantId) {
      const variantFound = await this.variantRepository.getVariantById(
        itemDto.productVariantId,
      );
      if (!variantFound) {
        throw new NotFoundException('Variant not found');
      }
      unitPrice = variantFound.price;
    }
    const discount = itemDto.discount || 0;
    const toCreate = new CartItem(
      new Types.ObjectId().toString(),
      cartFound.id,
      itemDto.productType,
      itemDto.productId,
      itemDto.quantity,
      unitPrice,
      discount,
			new Date(),
			new Date(),

			itemDto.productVariantId || undefined,
    );
    await this.cartItemRepository.createItem(toCreate);
    return cartFound;
  }
}
