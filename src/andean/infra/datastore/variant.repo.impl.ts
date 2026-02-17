import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { instanceToPlain } from 'class-transformer';
import { VariantRepository as VariantRepositoryBase } from '../../app/datastore/Variant.repo';
import { Variant } from '../../domain/entities/Variant';
import { VariantDocument } from '../persistence/variant.schema';
import { VariantMapper } from '../services/VariantMapper';
import { MongoIdUtils } from '../utils/MongoIdUtils';

@Injectable()
export class VariantRepositoryImpl extends VariantRepositoryBase {
	constructor(
		@InjectModel('Variant') private variantModel: Model<VariantDocument>,
	) {
		super();
	}

	async create(variant: Variant): Promise<Variant> {
		const plain = VariantMapper.toPersistence(variant);
		const created = new this.variantModel(plain);
		const savedVariant = await created.save();
		return VariantMapper.fromDocument(savedVariant);
	}

	async createMany(variants: Variant[]): Promise<Variant[]> {
		const documents = variants.map((variant) =>
			VariantMapper.toPersistence(variant),
		);
		const savedDocs = await this.variantModel.insertMany(documents);
		return savedDocs.map((doc) =>
			VariantMapper.fromDocument(doc as VariantDocument),
		);
	}

	async getById(id: string): Promise<Variant | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.variantModel.findById(objectId).exec();
		return doc ? VariantMapper.fromDocument(doc) : null;
	}

	async getAll(): Promise<Variant[]> {
		const docs = await this.variantModel.find().exec();
		return docs.map((doc) => VariantMapper.fromDocument(doc));
	}

	async getByProductId(productId: string): Promise<Variant[]> {
		const docs = await this.variantModel.find({ productId }).exec();
		return docs.map((doc) => VariantMapper.fromDocument(doc));
	}

	async update(id: string, variant: Partial<Variant>): Promise<Variant | null> {
		const plain = instanceToPlain(variant);
		const { id: _, ...dataForDB } = plain;
		dataForDB.updatedAt = new Date();

		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.variantModel
			.findByIdAndUpdate(objectId, dataForDB, { new: true })
			.exec();
		return updated ? VariantMapper.fromDocument(updated) : null;
	}

	async delete(id: string): Promise<boolean> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const result = await this.variantModel.findByIdAndDelete(objectId).exec();
		return result !== null;
	}

	async deleteByProductId(productId: string): Promise<boolean> {
		const result = await this.variantModel.deleteMany({ productId }).exec();
		return result.deletedCount > 0;
	}

	async getByIds(ids: string[]): Promise<Variant[]> {
		if (!ids.length) return [];
		const objectIds = ids.map((id) => MongoIdUtils.stringToObjectId(id));
		const docs = await this.variantModel.find({ _id: { $in: objectIds } }).exec();
		return docs.map((doc) => VariantMapper.fromDocument(doc));
	}

	async reduceStock(id: string, quantity: number): Promise<Variant | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.variantModel
			.findOneAndUpdate(
				{ _id: objectId, stock: { $gte: quantity } },
				{ $inc: { stock: -quantity }, $set: { updatedAt: new Date() } },
				{ new: true },
			)
			.exec();
		return updated ? VariantMapper.fromDocument(updated) : null;
	}
}
