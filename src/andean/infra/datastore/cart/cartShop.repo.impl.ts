import { Injectable } from '@nestjs/common';
import { CartShopRepository } from '../../../app/datastore/CartShop.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartShopDocument } from '../../persistence/cartShop.schema';
import { CartShop } from '../../../domain/entities/CartShop';
import { CartShopMapper } from '../../services/cart/CartShopMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class CartShopRepoImpl extends CartShopRepository {
	constructor(
		@InjectModel('CartShop')
		private readonly cartShopModel: Model<CartShopDocument>,
	) {
		super();
	}

	async getCartByCustomerId(customerId: string): Promise<CartShop | null> {
		const doc = await this.cartShopModel.findOne({ customerId }).exec();
		return doc ? CartShopMapper.fromDocument(doc) : null;
	}

	async getCartByCustomerEmail(customerEmail: string): Promise<CartShop | null> {
		const doc = await this.cartShopModel.findOne({ customerEmail }).exec();
		return doc ? CartShopMapper.fromDocument(doc) : null;
	}

	async getCartByIdentifier(customerId?: string, customerEmail?: string): Promise<CartShop | null> {
		if (customerId) {
			return this.getCartByCustomerId(customerId);
		}
		if (customerEmail) {
			return this.getCartByCustomerEmail(customerEmail);
		}
		return null;
	}

	async getCartById(cartShopId: string): Promise<CartShop | null> {
		const objectId = MongoIdUtils.stringToObjectId(cartShopId);
		const doc = await this.cartShopModel.findById(objectId).exec();
		return doc ? CartShopMapper.fromDocument(doc) : null;
	}

	async createCart(cart: CartShop): Promise<CartShop> {
		const created = new this.cartShopModel(CartShopMapper.toPersistence(cart));
		const cartSaved = await created.save();
		return CartShopMapper.fromDocument(cartSaved);
	}

	async clearCart(customerId?: string, customerEmail?: string): Promise<void> {
		let cart: CartShopDocument | null = null;
		if (customerId) {
			cart = await this.cartShopModel.findOne({ customerId }).exec();
		} else if (customerEmail) {
			cart = await this.cartShopModel.findOne({ customerEmail }).exec();
		}
		if (!cart) return;
		await cart.save();
	}
}
