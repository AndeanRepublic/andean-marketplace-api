import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { ProductRepository } from '../../datastore/Product.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { AddCartItemDto } from '../../../infra/controllers/dto/AddCartItemDto';
import { CartShop } from '../../../domain/entities/CartShop';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { ProductVariantRepository } from '../../datastore/ProductVariant.repo';
import { CartItem } from '../../../domain/entities/CartItem';

@Injectable()
export class AddItemToCartUseCase {
  constructor(
    @Inject(CustomerProfileRepository)
    private readonly userRepository: CustomerProfileRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
    @Inject(ProductVariantRepository)
    private readonly variantRepository: ProductVariantRepository,
    @Inject(CartShopRepository)
    private readonly cartShopRepository: CartShopRepository,
    @Inject(CartShopItemRepository)
    private readonly cartItemRepository: CartShopItemRepository,
  ) {}

  async handle(userId: string, itemDto: AddCartItemDto): Promise<CartShop> {
    const customerFound = await this.userRepository.getCustomerById(userId);
    if (!customerFound) {
      throw new NotFoundException('CustomerProfile not found');
    }
    const productFound = await this.productRepository.getProductById(
      itemDto.productId,
    );
    if (!productFound) {
      throw new NotFoundException('Product not found');
    }
    let cartFound = await this.cartShopRepository.getCartByUser(userId);
    if (!cartFound) {
      cartFound = new CartShop(crypto.randomUUID(), userId);
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
    const toCreate = new CartItem(
      crypto.randomUUID(),
      userId,
      cartFound.id,
      itemDto.productId,
      itemDto.productVariantId,
      itemDto.quantity,
      unitPrice,
    );
    await this.cartItemRepository.createItem(toCreate);
    return cartFound;
  }
}
