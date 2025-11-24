import { CartShopItemRepository } from '../../app/datastore/CartShopItem.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CartShopItemDocument } from '../persistence/cartShopItem.schema';
import { CartItem } from 'src/andean/domain/entities/CartItem';
import { CartItemMapper } from '../services/CartItemMapper';

@Injectable()
export class CartShopItemRepoImpl extends CartShopItemRepository {
  constructor(
    @InjectModel('CartShopItem')
    private readonly cartShopItemModel: Model<CartShopItemDocument>,
  ) {
    super();
  }

  async getItemsByCartId(cartId: string): Promise<CartItem[]> {
    const docs = await this.cartShopItemModel.find({ cartId }).exec();
    return docs.map((doc: CartShopItemDocument) =>
      CartItemMapper.toDomain(doc),
    );
  }

  async getItemsByUserId(userId: string): Promise<CartItem[]> {
    const docs = await this.cartShopItemModel.find({ userId }).exec();
    return docs.map((doc: CartShopItemDocument) =>
      CartItemMapper.toDomain(doc),
    );
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

  async deleteItemsByUserId(userId: string): Promise<void> {
    await this.cartShopItemModel.deleteMany({ where: { userId: userId } });
  }
}
