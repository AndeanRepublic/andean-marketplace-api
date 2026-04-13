import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import {
	SuperfoodProductFilters,
	SuperfoodProductRepository,
} from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodProductDocument } from '../../persistence/superfood/superfood.schema';
import { SuperfoodProductMapper } from '../../services/superfood/SuperfoodProductMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { ProductSortBy } from '../../../domain/enums/ProductSortBy';
import { SuperfoodProductListAggregateRow } from '../../../app/models/superfoods/SuperfoodProductListItem';
import { BoxCatalogSuperfoodItem } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodProductStatus } from '../../../domain/enums/SuperfoodProductStatus';

@Injectable()
export class SuperfoodProductRepoImpl implements SuperfoodProductRepository {
	constructor(
		@InjectModel('SuperfoodProduct')
		private readonly model: Model<SuperfoodProductDocument>,
	) {}

	async getSuperfoodProductById(id: string): Promise<SuperfoodProduct | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return SuperfoodProductMapper.fromDocument(doc);
	}

	async saveSuperfoodProduct(
		product: SuperfoodProduct,
	): Promise<SuperfoodProduct> {
		const persistenceData = SuperfoodProductMapper.toPersistence(product);
		const _id = new Types.ObjectId(product.id);
		const newDoc = new this.model({
			...persistenceData,
			_id,
			id: product.id,
		});
		const savedDoc = await newDoc.save();
		return SuperfoodProductMapper.fromDocument(savedDoc);
	}

	async updateSuperfoodProduct(
		product: SuperfoodProduct,
	): Promise<SuperfoodProduct> {
		const persistenceData = SuperfoodProductMapper.toPersistence(product);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: product.id },
				{ $set: persistenceData },
				{ new: true },
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('Product not found for update');
		}

		return SuperfoodProductMapper.fromDocument(updatedDoc);
	}

	async deleteSuperfoodProduct(id: string): Promise<void> {
		await this.model.deleteOne({ id }).exec();
	}

	async getByIds(ids: string[]): Promise<SuperfoodProduct[]> {
		if (!ids.length) return [];
		const docs = await this.model.find({ id: { $in: ids } }).exec();
		return docs.map((doc) => SuperfoodProductMapper.fromDocument(doc));
	}

	async reduceStock(
		id: string,
		quantity: number,
	): Promise<SuperfoodProduct | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.model
			.findOneAndUpdate(
				{ _id: objectId, 'priceInventory.totalStock': { $gte: quantity } },
				{
					$inc: { 'priceInventory.totalStock': -quantity },
					$set: { updatedAt: new Date() },
				},
				{ new: true },
			)
			.exec();
		return updated ? SuperfoodProductMapper.fromDocument(updated) : null;
	}

	async updateStatus(
		id: string,
		status: SuperfoodProductStatus,
	): Promise<SuperfoodProduct | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.model
			.findByIdAndUpdate(
				objectId,
				{ $set: { status, updatedAt: new Date() } },
				{ new: true },
			)
			.exec();
		return updated ? SuperfoodProductMapper.fromDocument(updated) : null;
	}

	/**
	 * Construye el query base con los filtros proporcionados
	 */
	private buildBaseQuery(
		filters: SuperfoodProductFilters,
	): FilterQuery<SuperfoodProductDocument> {
		const query: FilterQuery<SuperfoodProductDocument> = {};

		// Filtro por rango de precio
		if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
			query['priceInventory.basePrice'] = {};
			if (filters.minPrice !== undefined) {
				query['priceInventory.basePrice'].$gte = filters.minPrice;
			}
			if (filters.maxPrice !== undefined) {
				query['priceInventory.basePrice'].$lte = filters.maxPrice;
			}
		}

		// Filtro por categoryId
		if (filters.categoryId) {
			query.categoryId = filters.categoryId;
		}

		// Filtro por ownerId
		if (filters.ownerId) {
			query['baseInfo.ownerId'] = filters.ownerId;
		}

		// Solo productos con stock disponible
		query['priceInventory.totalStock'] = { $gt: 0 };

		return query;
	}

	/**
	 * Construye los stages de ordenamiento según el criterio especificado
	 */
	private buildSortStages(sortBy?: ProductSortBy): PipelineStage[] {
		if (!sortBy || sortBy === ProductSortBy.LATEST) {
			return [{ $sort: { createdAt: -1 } }];
		}

		if (sortBy === ProductSortBy.POPULAR) {
			return [
				{
					$lookup: {
						from: 'orders',
						let: { productId: { $toString: '$_id' } },
						pipeline: [
							{
								$match: {
									'items.productId': { $exists: true },
								},
							},
							{
								$unwind: '$items',
							},
							{
								$match: {
									$expr: { $eq: ['$items.productId', '$$productId'] },
								},
							},
							{
								$group: {
									_id: '$items.productId',
									totalSold: { $sum: '$items.quantity' },
								},
							},
						],
						as: 'salesData',
					},
				},
				{
					$addFields: {
						totalSold: {
							$ifNull: [{ $arrayElemAt: ['$salesData.totalSold', 0] }, 0],
						},
					},
				},
				{ $sort: { totalSold: -1, createdAt: -1 } },
			];
		}

		return [{ $sort: { createdAt: -1 } }];
	}

	/**
	 * Construye los lookups para shop (nombre de tienda) o community
	 */
	private buildSellerLookups(): PipelineStage[] {
		return [
			{
				$lookup: {
					from: 'shops',
					let: { ownerId: '$baseInfo.ownerId' },
					pipeline: [
						{ $match: { $expr: { $eq: ['$sellerId', '$$ownerId'] } } },
						{ $limit: 1 },
					],
					as: 'shop',
				},
			},
			{
				$lookup: {
					from: 'communities',
					let: {
						ownId: {
							$convert: {
								input: '$baseInfo.ownerId',
								to: 'objectId',
								onError: null,
								onNull: null,
							},
						},
					},
					pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$ownId'] } } }],
					as: 'community',
				},
			},
		];
	}

	/** Proyección del listado; medios se resuelven en el use case (batch). */
	private buildFinalProjection(): PipelineStage {
		return {
			$project: {
				_id: 0,
				id: { $toString: '$_id' },
				colorId: '$colorId',
				title: '$baseInfo.title',
				ownerName: {
					$cond: {
						if: { $gt: [{ $size: '$shop' }, 0] },
						then: { $arrayElemAt: ['$shop.name', 0] },
						else: {
							$cond: {
								if: { $gt: [{ $size: '$community' }, 0] },
								then: { $arrayElemAt: ['$community.name', 0] },
								else: 'Propietario desconocido',
							},
						},
					},
				},
				price: '$priceInventory.basePrice',
				totalStock: '$priceInventory.totalStock',
				status: '$status',
				mainImgId: {
					$ifNull: ['$baseInfo.productMedia.mainImgId', ''],
				},
				sourceProductImgId: {
					$ifNull: ['$baseInfo.productMedia.sourceProductImgId', ''],
				},
				nutritionItems: {
					$map: {
						input: {
							$filter: {
								input: {
									$ifNull: ['$servingNutrition.servingNutritionalContent', []],
								},
								as: 'item',
								cond: { $eq: ['$$item.selected', true] },
							},
						},
						as: 'selectedItem',
						in: '$$selectedItem.nutrient',
					},
				},
			},
		};
	}

	async getAllWithFilters(
		filters: SuperfoodProductFilters,
	): Promise<{ products: SuperfoodProductListAggregateRow[]; total: number }> {
		const query = this.buildBaseQuery(filters);

		// Paginación
		const page = filters.page || 1;
		const perPage = filters.perPage || 10;
		const skip = (page - 1) * perPage;

		// Aggregation pipeline
		const pipeline: PipelineStage[] = [
			{ $match: query },
			...this.buildSortStages(filters.sortBy),
			...this.buildSellerLookups(),
			this.buildFinalProjection(),
			{ $skip: skip },
			{ $limit: perPage },
		];

		const [products, countResult] = await Promise.all([
			this.model.aggregate(pipeline).exec(),
			this.model.countDocuments(query).exec(),
		]);

		return {
			products: products as SuperfoodProductListAggregateRow[],
			total: countResult,
		};
	}

	async getBoxCatalogAll(): Promise<Array<BoxCatalogSuperfoodItem>> {
		const match: FilterQuery<SuperfoodProductDocument> = {
			'priceInventory.totalStock': { $gt: 0 },
		};

		const pipeline: PipelineStage[] = [
			{ $match: match },
			{ $sort: { createdAt: -1 } },
			{
				$lookup: {
					from: 'superfoodcategories',
					let: {
						cid: {
							$convert: {
								input: '$categoryId',
								to: 'objectId',
								onError: null,
								onNull: null,
							},
						},
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [{ $ne: ['$$cid', null] }, { $eq: ['$_id', '$$cid'] }],
								},
							},
						},
						{ $limit: 1 },
					],
					as: 'cat',
				},
			},
			{
				$project: {
					_id: 0,
					id: { $toString: '$_id' },
					title: '$baseInfo.title',
					categoryName: {
						$ifNull: [{ $arrayElemAt: ['$cat.name', 0] }, ''],
					},
					imgId: {
						$ifNull: ['$baseInfo.productMedia.mainImgId', ''],
					},
					catalogPrice: '$priceInventory.basePrice',
					totalStock: '$priceInventory.totalStock',
				},
			},
		];

		const rows = await this.model.aggregate(pipeline).exec();

		return rows as Array<BoxCatalogSuperfoodItem>;
	}

	async getBoxCatalogAllIncludingZeroStock(): Promise<Array<BoxCatalogSuperfoodItem>> {
		const pipeline: PipelineStage[] = [
			{ $sort: { createdAt: -1 } },
			{
				$lookup: {
					from: 'superfoodcategories',
					let: {
						cid: {
							$convert: {
								input: '$categoryId',
								to: 'objectId',
								onError: null,
								onNull: null,
							},
						},
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [{ $ne: ['$$cid', null] }, { $eq: ['$_id', '$$cid'] }],
								},
							},
						},
						{ $limit: 1 },
					],
					as: 'cat',
				},
			},
			{
				$project: {
					_id: 0,
					id: { $toString: '$_id' },
					title: '$baseInfo.title',
					categoryName: {
						$ifNull: [{ $arrayElemAt: ['$cat.name', 0] }, ''],
					},
					imgId: {
						$ifNull: ['$baseInfo.productMedia.mainImgId', ''],
					},
					catalogPrice: '$priceInventory.basePrice',
					totalStock: '$priceInventory.totalStock',
				},
			},
		];

		const rows = await this.model.aggregate(pipeline).exec();
		return rows as Array<BoxCatalogSuperfoodItem>;
	}
}
