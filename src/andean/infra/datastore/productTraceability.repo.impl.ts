import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductTraceabilityRepository } from '../../app/datastore/productTraceability.repo';
import { ProductTraceability } from '../../domain/entities/ProductTraceability';
import { ProductTraceabilityDocument } from '../persistence/productTraceability.schema';
import { ProductTraceabilityMapper } from '../services/ProductTraceabilityMapper';
import { ProductType } from '../../domain/enums/ProductType';

@Injectable()
export class ProductTraceabilityRepositoryImpl extends ProductTraceabilityRepository {
	constructor(
		@InjectModel('ProductTraceability') private traceabilityModel: Model<ProductTraceabilityDocument>,
	) {
		super();
	}

	async create(traceability: ProductTraceability): Promise<ProductTraceability> {
		const document = {
			id: traceability.id,
			productId: traceability.productId,
			productType: traceability.productType,
			blockchainLink: traceability.blockchainLink,
			epochs: traceability.epochs.map(epoch => ({
				title: epoch.title,
				country: epoch.country,
				city: epoch.city,
				description: epoch.description,
				processName: epoch.processName,
				supplier: epoch.supplier,
			})),
		};
		const created = await this.traceabilityModel.create(document);
		return ProductTraceabilityMapper.fromDocument(created);
	}

	async findById(id: string): Promise<ProductTraceability | null> {
		const document = await this.traceabilityModel.findOne({ id }).exec();
		return document ? ProductTraceabilityMapper.fromDocument(document) : null;
	}

	async findAll(): Promise<ProductTraceability[]> {
		const documents = await this.traceabilityModel.find().exec();
		return documents.map((doc) => ProductTraceabilityMapper.fromDocument(doc));
	}

	async findByProductId(productId: string): Promise<ProductTraceability | null> {
		const document = await this.traceabilityModel.findOne({ productId }).exec();
		return document ? ProductTraceabilityMapper.fromDocument(document) : null;
	}

	async findByProductType(productType: ProductType): Promise<ProductTraceability[]> {
		const documents = await this.traceabilityModel.find({ productType }).exec();
		return documents.map((doc) => ProductTraceabilityMapper.fromDocument(doc));
	}

	async update(id: string, traceability: Partial<ProductTraceability>): Promise<ProductTraceability | null> {
		const updateData: any = {};

		if (traceability.productId !== undefined) {
			updateData.productId = traceability.productId;
		}
		if (traceability.productType !== undefined) {
			updateData.productType = traceability.productType;
		}
		if (traceability.blockchainLink !== undefined) {
			updateData.blockchainLink = traceability.blockchainLink;
		}
		if (traceability.epochs !== undefined) {
			updateData.epochs = traceability.epochs.map(epoch => ({
				title: epoch.title,
				country: epoch.country,
				city: epoch.city,
				description: epoch.description,
				processName: epoch.processName,
				supplier: epoch.supplier,
			}));
		}

		const updated = await this.traceabilityModel
			.findOneAndUpdate({ id }, updateData, { new: true })
			.exec();

		return updated ? ProductTraceabilityMapper.fromDocument(updated) : null;
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.traceabilityModel.deleteOne({ id }).exec();
		return result.deletedCount > 0;
	}
}
