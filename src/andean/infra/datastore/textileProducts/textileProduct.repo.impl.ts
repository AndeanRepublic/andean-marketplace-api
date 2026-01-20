import { Injectable } from '@nestjs/common';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileProductDocument } from '../../persistence/textileProducts/textileProduct.schema';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductMapper } from '../../services/textileProducts/TextileProductMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class TextileProductRepositoryImpl extends TextileProductRepository {
	constructor(
		@InjectModel('TextileProduct')
		private readonly textileProductModel: Model<TextileProductDocument>,
	) {
		super();
	}

	async getAllTextileProducts(): Promise<TextileProduct[]> {
		const docs = await this.textileProductModel.find().exec();
		return docs.map((doc) => TextileProductMapper.fromDocument(doc));
	}

	async getAllWithPagination(page: number, perPage: number): Promise<{ products: TextileProduct[]; total: number }> {
		const skip = (page - 1) * perPage;
		const [docs, total] = await Promise.all([
			this.textileProductModel.find().skip(skip).limit(perPage).exec(),
			this.textileProductModel.countDocuments().exec(),
		]);
		const products = docs.map((doc) => TextileProductMapper.fromDocument(doc));
		return { products, total };
	}

	async getTextileProductById(id: string): Promise<TextileProduct | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.textileProductModel.findById(objectId).exec();
		return doc ? TextileProductMapper.fromDocument(doc) : null;
	}

	async saveTextileProduct(product: TextileProduct): Promise<TextileProduct> {
		const plain = TextileProductMapper.toPersistence(product);
		const created = new this.textileProductModel(plain);
		const savedProduct = await created.save();
		return TextileProductMapper.fromDocument(savedProduct);
	}

	async updateTextileProduct(
		id: string,
		product: TextileProduct,
	): Promise<TextileProduct> {
		const plain = TextileProductMapper.toPersistence(product);
		const { createdAt, ...updateData } = plain;
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.textileProductModel
			.findByIdAndUpdate(objectId, { $set: updateData }, { new: true })
			.exec();
		return TextileProductMapper.fromDocument(updated!);
	}

	async getAllWithFilters(filters: any): Promise<{ products: TextileProduct[]; total: number }> {
		const query: any = {};

		// Filtro por categoryId
		if (filters.categoryId) {
			query.categoryId = filters.categoryId;
		}

		// Filtro por ownerId
		if (filters.ownerId) {
			query['baseInfo.ownerId'] = filters.ownerId;
		}

		// Filtro por color en variants
		if (filters.color) {
			query.variants = {
				...query.variants,
				$elemMatch: {
					...((query.variants as any)?.$elemMatch || {}),
					$or: [
						{ 'combination.color': { $regex: new RegExp(filters.color, 'i') } },
						{ 'combination.Color': { $regex: new RegExp(filters.color, 'i') } },
					]
				}
			};
		}

		// Filtro por size en variants
		if (filters.size) {
			if (query.variants?.$elemMatch) {
				query.variants.$elemMatch.$and = [
					...(query.variants.$elemMatch.$and || []),
					{
						$or: [
							{ 'combination.size': { $regex: new RegExp(filters.size, 'i') } },
							{ 'combination.Size': { $regex: new RegExp(filters.size, 'i') } },
							{ 'combination.talla': { $regex: new RegExp(filters.size, 'i') } },
							{ 'combination.Talla': { $regex: new RegExp(filters.size, 'i') } },
						]
					}
				];
			} else {
				query.variants = {
					$elemMatch: {
						$or: [
							{ 'combination.size': { $regex: new RegExp(filters.size, 'i') } },
							{ 'combination.Size': { $regex: new RegExp(filters.size, 'i') } },
							{ 'combination.talla': { $regex: new RegExp(filters.size, 'i') } },
							{ 'combination.Talla': { $regex: new RegExp(filters.size, 'i') } },
						]
					}
				};
			}
		}

		// Filtro por rango de precios (variants.price o priceInventary.basePrice)
		if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
			const priceConditions: any[] = [];

			// Condición para priceInventary.basePrice
			const basePriceCondition: any = {};
			if (filters.minPrice !== undefined) {
				basePriceCondition['priceInventary.basePrice'] = { $gte: filters.minPrice };
			}
			if (filters.maxPrice !== undefined) {
				basePriceCondition['priceInventary.basePrice'] = {
					...basePriceCondition['priceInventary.basePrice'],
					$lte: filters.maxPrice
				};
			}
			if (Object.keys(basePriceCondition).length > 0) {
				priceConditions.push(basePriceCondition);
			}

			// Condición para variants.price
			const variantPriceElemMatch: any = {};
			if (filters.minPrice !== undefined) {
				variantPriceElemMatch.price = { $gte: filters.minPrice };
			}
			if (filters.maxPrice !== undefined) {
				variantPriceElemMatch.price = {
					...variantPriceElemMatch.price,
					$lte: filters.maxPrice
				};
			}
			if (Object.keys(variantPriceElemMatch).length > 0) {
				priceConditions.push({
					variants: { $elemMatch: variantPriceElemMatch }
				});
			}

			if (priceConditions.length > 0) {
				query.$or = priceConditions;
			}
		}

		// Paginación
		const page = filters.page || 1;
		const perPage = filters.perPage || 10;
		const skip = (page - 1) * perPage;

		const [docs, total] = await Promise.all([
			this.textileProductModel.find(query).skip(skip).limit(perPage).exec(),
			this.textileProductModel.countDocuments(query).exec(),
		]);

		const products = docs.map((doc) => TextileProductMapper.fromDocument(doc));
		return { products, total };
	}

	async deleteTextileProduct(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.textileProductModel.findByIdAndDelete(objectId).exec();
		return;
	}
}
