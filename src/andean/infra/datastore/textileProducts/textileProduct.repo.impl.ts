import { Injectable } from '@nestjs/common';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileProductDocument } from '../../persistence/textileProducts/textileProduct.schema';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductMapper } from '../../services/textileProducts/TextileProductMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { FilterCount, FilterCountItem } from 'src/andean/app/modules/PaginatedProductsResponse';

@Injectable()
export class TextileProductRepositoryImpl extends TextileProductRepository {
	constructor(
		@InjectModel('TextileProduct')
		private readonly textileProductModel: Model<TextileProductDocument>,
	) {
		super();
	}

	/**
	 * Construye las condiciones de filtro de precio para variants y priceInventary
	 */
	private buildPriceFilterConditions(minPrice?: number, maxPrice?: number): any[] {
		const priceConditions: any[] = [];

		// Condición para priceInventary.basePrice
		const basePriceCondition: any = {};
		if (minPrice !== undefined) {
			basePriceCondition['priceInventary.basePrice'] = { $gte: minPrice };
		}
		if (maxPrice !== undefined) {
			basePriceCondition['priceInventary.basePrice'] = {
				...basePriceCondition['priceInventary.basePrice'],
				$lte: maxPrice
			};
		}
		if (Object.keys(basePriceCondition).length > 0) {
			priceConditions.push(basePriceCondition);
		}

		// Condición para variants.price
		const variantPriceElemMatch: any = {};
		if (minPrice !== undefined) {
			variantPriceElemMatch.price = { $gte: minPrice };
		}
		if (maxPrice !== undefined) {
			variantPriceElemMatch.price = {
				...variantPriceElemMatch.price,
				$lte: maxPrice
			};
		}
		if (Object.keys(variantPriceElemMatch).length > 0) {
			priceConditions.push({
				variants: { $elemMatch: variantPriceElemMatch }
			});
		}

		return priceConditions;
	}

	/**
	 * Construye el query base con filtros comunes (categoryId, ownerId, precio)
	 */
	private buildBaseQuery(filters?: any): any {
		const baseQuery: any = {};

		if (filters?.categoryId) {
			baseQuery.categoryId = filters.categoryId;
		}

		if (filters?.ownerId) {
			baseQuery['baseInfo.ownerId'] = filters.ownerId;
		}

		if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
			const priceConditions = this.buildPriceFilterConditions(filters.minPrice, filters.maxPrice);
			if (priceConditions.length > 0) {
				baseQuery.$or = priceConditions;
			}
		}

		return baseQuery;
	}

	/**
	 * Construye expresión $ifNull encadenada para múltiples campos variantes
	 */
	private buildVariantFieldExpression(fieldNames: string[]): any {
		if (fieldNames.length === 0) return null;
		if (fieldNames.length === 1) return `$variants.combination.${fieldNames[0]}`;

		return fieldNames.reduceRight<any>((acc, field, index) => {
			const fieldPath = `$variants.combination.${field}`;
			if (index === fieldNames.length - 1) {
				return { $ifNull: [fieldPath, null] };
			}
			return { $ifNull: [fieldPath, acc] };
		}, null);
	}

	/**
	 * Ejecuta una aggregation para contar valores únicos de un campo variante
	 */
	private async aggregateVariantField(
		baseQuery: any,
		fieldNames: string[]
	): Promise<Array<{ _id: string; count: number }>> {
		const fieldExpression = this.buildVariantFieldExpression(fieldNames);

		return await this.textileProductModel.aggregate([
			{ $match: baseQuery },
			{ $unwind: '$variants' },
			{
				$group: {
					_id: { $toLower: fieldExpression },
					count: { $sum: 1 }
				}
			},
			{ $match: { _id: { $ne: null } } },
			{ $sort: { count: -1 } }
		]);
	}

	/**
	 * Ejecuta una aggregation para contar y hacer lookup de documentos relacionados
	 */
	private async aggregateWithLookup(
		baseQuery: any,
		sourceField: string,
		lookupCollection: string,
		labelField: string
	): Promise<Array<{ label: string; count: number }>> {
		return await this.textileProductModel.aggregate([
			{ $match: baseQuery },
			{
				$match: {
					[sourceField]: { $exists: true, $ne: null }
				}
			},
			{
				$addFields: {
					objectId: {
						$convert: {
							input: `$${sourceField}`,
							to: 'objectId',
							onError: null,
							onNull: null
						}
					}
				}
			},
			{
				$group: {
					_id: '$objectId',
					count: { $sum: 1 }
				}
			},
			{ $match: { _id: { $ne: null } } },
			{ $sort: { count: -1 } },
			{
				$lookup: {
					from: lookupCollection,
					localField: '_id',
					foreignField: '_id',
					as: 'doc'
				}
			},
			{ $unwind: { path: '$doc', preserveNullAndEmptyArrays: false } },
			{
				$project: {
					_id: 0,
					label: `$doc.${labelField}`,
					count: 1
				}
			}
		]);
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
		const query = this.buildBaseQuery(filters);

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

	async getFilterCounts(filters?: any): Promise<FilterCount> {
		const baseQuery = this.buildBaseQuery(filters);

		// Aggregation para contar colores
		const colorAggregation = await this.aggregateVariantField(
			baseQuery,
			['color', 'Color']
		);

		// Aggregation para contar tallas/sizes
		const sizeAggregation = await this.aggregateVariantField(
			baseQuery,
			['size', 'Size', 'talla', 'Talla']
		);

		// Aggregation para contar comunidades
		const communityAggregation = await this.aggregateWithLookup(
			baseQuery,
			'detailTraceability.communityId',
			'communities',
			'name'
		);

		// Aggregation para contar categorías
		const categoryAggregation = await this.aggregateWithLookup(
			baseQuery,
			'categoryId',
			'textilecategories',
			'name'
		);

		const filterCount: FilterCount = {
			colors: colorAggregation.map((item) => ({
				label: item._id,
				count: item.count
			})),
			sizes: sizeAggregation.map((item) => ({
				label: item._id,
				count: item.count
			})),
			communities: communityAggregation.map((item) => ({
				label: item.label,
				count: item.count
			})),
			categories: categoryAggregation.map((item) => ({
				label: item.label,
				count: item.count
			}))
		};

		return filterCount;
	}
}
