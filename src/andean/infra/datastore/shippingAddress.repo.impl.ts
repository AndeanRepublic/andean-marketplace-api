import { Injectable } from '@nestjs/common';
import { ShippingAddressRepository } from '../../app/datastore/ShippingAddress.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingAddressDocument } from '../persistence/shippingAddress.schema';
import { ShippingAddress } from '../../domain/entities/ShippingAddress';
import { ShippingAddressMapper } from '../services/ShippingAddressMapper';
import { MongoIdUtils } from '../utils/MongoIdUtils';

@Injectable()
export class ShippingAddressRepositoryImpl extends ShippingAddressRepository {
	constructor(
		@InjectModel('ShippingAddress')
		private readonly shippingAddressModel: Model<ShippingAddressDocument>,
	) {
		super();
	}

	async create(shippingAddress: ShippingAddress): Promise<ShippingAddress> {
		const plain = ShippingAddressMapper.toPersistence(shippingAddress);
		const created = new this.shippingAddressModel(plain);
		const saved = await created.save();
		return ShippingAddressMapper.fromDocument(saved);
	}

	async getById(id: string): Promise<ShippingAddress | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.shippingAddressModel.findById(objectId).exec();
		return doc ? ShippingAddressMapper.fromDocument(doc) : null;
	}

	async getByCustomerId(customerId: string): Promise<ShippingAddress[]> {
		const docs = await this.shippingAddressModel
			.find({ customerId })
			.sort({ isDefault: -1, createdAt: -1 })
			.exec();
		return docs.map((doc) => ShippingAddressMapper.fromDocument(doc));
	}

	async update(
		id: string,
		shippingAddress: Partial<ShippingAddress>,
	): Promise<ShippingAddress> {
		const plain = ShippingAddressMapper.toPersistence(shippingAddress);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.shippingAddressModel
			.findByIdAndUpdate(
				objectId,
				{ $set: { ...plain, updatedAt: new Date() } },
				{ new: true },
			)
			.exec();
		if (!updated) {
			throw new Error('ShippingAddress not found');
		}
		return ShippingAddressMapper.fromDocument(updated);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.shippingAddressModel.findByIdAndDelete(objectId).exec();
	}

	async setAsDefault(
		id: string,
		customerId: string,
	): Promise<ShippingAddress> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		
		// Primero, quitar isDefault de todas las direcciones del cliente
		await this.shippingAddressModel
			.updateMany(
				{ customerId },
				{ $set: { isDefault: false } },
			)
			.exec();

		// Luego, marcar la dirección especificada como default
		const updated = await this.shippingAddressModel
			.findByIdAndUpdate(
				objectId,
				{ $set: { isDefault: true, updatedAt: new Date() } },
				{ new: true },
			)
			.exec();

		if (!updated) {
			throw new Error('ShippingAddress not found');
		}

		return ShippingAddressMapper.fromDocument(updated);
	}
}
