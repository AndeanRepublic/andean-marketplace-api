import { CartShopItemRepo } from '../../app/datastore/CartShopItem.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CartShopItemDocument } from '../persistence/cartShopItem.schema';
import { CartItem } from 'src/andean/domain/entities/CartItem';
import { CartItemMapper } from '../services/CartItemMapper';

@Injectable()
export class CartShopItemRepoImpl extends CartShopItemRepo {
  constructor(
    @InjectModel('CartShopItem')
    private readonly cartShopItemModel: Model<CartShopItemDocument>,
  ) {
    super();
  }

  async createItem(item: CartItem): Promise<CartItem> {
    const created = new this.cartShopItemModel(
      CartItemMapper.toPersistence(item),
    );
    const savedItem = await created.save();
    return CartItemMapper.toDomain(savedItem);
  }

  async deleteItem(itemId: string): Promise<void> {
    await this.cartShopItemModel.findByIdAndDelete(itemId).exec();
  }
}
