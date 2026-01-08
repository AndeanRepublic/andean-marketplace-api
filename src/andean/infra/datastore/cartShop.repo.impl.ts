import { Injectable } from '@nestjs/common';
import { CartShopRepository } from '../../app/datastore/CartShop.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartShopDocument } from '../persistence/cartShop.schema';
import { CartShop } from '../../domain/entities/CartShop';
import { CartShopMapper } from '../services/CartShopMapper';

@Injectable()
export class CartShopRepoImpl extends CartShopRepository {
  constructor(
    @InjectModel('CartShop')
    private readonly cartShopModel: Model<CartShopDocument>,
  ) {
    super();
  }

  async getCartByUser(customerId: string): Promise<CartShop | null> {
    return this.cartShopModel.findOne({ customerId });
  }

  async createCart(cart: CartShop): Promise<CartShop> {
    const created = new this.cartShopModel(CartShopMapper.toPersistence(cart));
    const cartSaved = await created.save();
    return CartShopMapper.fromDocument(cartSaved);
  }

  async clearCart(customerId: string): Promise<void> {
    const cart = await this.cartShopModel.findOne({ customerId });
    if (!cart) return;
    await cart.save();
  }
}
