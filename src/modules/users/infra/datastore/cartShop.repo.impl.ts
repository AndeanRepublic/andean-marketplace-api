import { Injectable } from '@nestjs/common';
import { CartShopRepository } from '../../app/datastore/CartShop.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartShopDocument } from '../persistence/cartShop.schema';
import { CartShop } from '../../domain/entities/CartShop';

@Injectable()
export class CartShopRepoImpl extends CartShopRepository {
  constructor(
    @InjectModel('CartShop')
    private readonly cartShopModel: Model<CartShopDocument>,
  ) {
    super();
  }

  async addItem(
    customerId: string,
    productId: string,
    quantity: number,
  ): Promise<CartShop> {
    let cart = await this.cartShopModel.findOne({ customerId });
    if (!cart) {
      cart = new this.cartShopModel({
        customerId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    await cart.save();
    return cart;
  }

  async removeItem(customerId: string, productId: string): Promise<CartShop> {
    const cart = await this.cartShopModel.findOne({ customerId });
    if (!cart) return null;

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    await cart.save();
    return cart;
  }

  async getCartByUser(customerId: string): Promise<CartShop> {
    return this.cartShopModel.findOne({ customerId });
  }

  async clearCart(customerId: string): Promise<void> {
    const cart = await this.cartShopModel.findOne({ customerId });
    if (!cart) return;

    cart.items = [];
    await cart.save();
  }
}
