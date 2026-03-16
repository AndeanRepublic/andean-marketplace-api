import { Injectable } from '@nestjs/common';
import {
	TextileProductRepository,
	ProductFilters,
} from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { Model, FilterQuery, PipelineStage, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileProductDocument } from '../../persistence/textileProducts/textileProduct.schema';
import { VariantDocument } from '../../persistence/variant.schema';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductMapper } from '../../services/textileProducts/TextileProductMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { FilterCount } from 'src/andean/app/modules/shared/PaginatedProductsResponse';
import { TextileProductListItem } from '../../../app/modules/textile/TextileProductListItemResponse';
import { ProductSortBy } from 'src/andean/domain/enums/ProductSortBy';
import { VariantMapper } from '../../services/VariantMapper';
import { TextileProductAttributesAssembler } from '../../services/textileProducts/TextileProductAttributesAssembler';

@Injectable()
export class TextileProductRepositoryImpl extends TextileProductRepository {
	constructor(
		@InjectModel('TextileProduct')
		private readonly textileProductModel: Model<TextileProductDocument>,
		@InjectModel('Variant')
		private readonly variantModel: Model<VariantDocument>,
		private readonly textileProductAttributesAssembler: TextileProductAttributesAssembler,
	) {
		super();
	}

	/**
	 * Construye las condiciones de filtro de precio para priceInventary
	 * Note: Variants have been removed
	 */
	private buildPriceFilterConditions(
		minPrice?: number,
		maxPrice?: number,
	): FilterQuery<TextileProductDocument>[] {
		const priceConditions: FilterQuery<TextileProductDocument>[] = [];

		// Condición para priceInventary.basePrice
		const basePriceCondition: Record<string, { $gte?: number; $lte?: number }> =
			{};
		if (minPrice !== undefined) {
			basePriceCondition['priceInventary.basePrice'] = { $gte: minPrice };
		}
		if (maxPrice !== undefined) {
			basePriceCondition['priceInventary.basePrice'] = {
				...basePriceCondition['priceInventary.basePrice'],
				$lte: maxPrice,
			};
		}
		if (Object.keys(basePriceCondition).length > 0) {
			priceConditions.push(basePriceCondition);
		}

		// Variants have been removed, only use basePrice from priceInventary
		// Price conditions are already handled above with priceInventary.basePrice

		return priceConditions;
	}

	/**
	 * Construye el query base con filtros comunes (categoryId, ownerId, precio, stock > 0)
	 */
	private buildBaseQuery(
		filters?: ProductFilters,
	): FilterQuery<TextileProductDocument> {
		const baseQuery: FilterQuery<TextileProductDocument> = {
			// Solo mostrar productos con stock disponible (totalStock > 0)
			'priceInventary.totalStock': { $gt: 0 },
		};

		if (filters?.categoryId) {
			baseQuery.categoryId = filters.categoryId;
		}

		if (filters?.ownerId) {
			baseQuery['baseInfo.ownerId'] = filters.ownerId;
		}

		if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
			const priceConditions = this.buildPriceFilterConditions(
				filters.minPrice,
				filters.maxPrice,
			);
			if (priceConditions.length > 0) {
				baseQuery.$or = priceConditions;
			}
		}

		return baseQuery;
	}

	/**
	 * Ejecuta una aggregation para contar valores únicos de un campo variante desde la nueva entidad Variant
	 */
	private async aggregateVariantFieldForFilter(
		baseQuery: FilterQuery<TextileProductDocument>,
		fieldNames: string[],
	): Promise<Array<{ _id: string; count: number }>> {
		// Primero obtener los productIds que cumplen el baseQuery
		const matchingProducts = await this.textileProductModel
			.find(baseQuery)
			.exec();
		const productIds = matchingProducts.map((p) =>
			(p as TextileProductDocument).toObject()._id.toString(),
		);

		if (productIds.length === 0) {
			return [];
		}

		// Buscar variants de esos productos
		const variants = await this.variantModel
			.find({
				productId: { $in: productIds },
			})
			.exec();

		// Contar valores únicos del campo en las combinaciones
		const counts: Record<string, number> = {};
		for (const variant of variants) {
			for (const fieldName of fieldNames) {
				const value =
					variant.combination[fieldName] ||
					variant.combination[fieldName.toLowerCase()];
				if (value) {
					const key = value.toLowerCase();
					counts[key] = (counts[key] || 0) + 1;
				}
			}
		}

		// Convertir a formato de respuesta
		return Object.entries(counts).map(([key, count]) => ({
			_id: key,
			count,
		}));
	}

	/**
	 * Aplica filtros de color y size a un query base usando la nueva entidad Variant
	 */
	private async applyVariantFilters(
		query: FilterQuery<TextileProductDocument>,
		filters: ProductFilters,
	): Promise<void> {
		const productIdConditions: string[] = [];

		// Filtro por color en variants
		if (filters.color) {
			const colorVariants = await this.variantModel
				.find({
					$or: [
						{ 'combination.color': { $regex: new RegExp(filters.color, 'i') } },
						{ 'combination.Color': { $regex: new RegExp(filters.color, 'i') } },
					],
				})
				.exec();
			const colorProductIds = [
				...new Set(colorVariants.map((v) => v.productId)),
			];
			if (colorProductIds.length > 0) {
				productIdConditions.push(...colorProductIds);
			} else {
				// Si no hay variants con ese color, no hay productos que cumplan
				productIdConditions.push(''); // Esto hará que no se encuentre nada
			}
		}

		// Filtro por size en variants
		if (filters.size) {
			const sizeVariants = await this.variantModel
				.find({
					$or: [
						{ 'combination.size': { $regex: new RegExp(filters.size, 'i') } },
						{ 'combination.Size': { $regex: new RegExp(filters.size, 'i') } },
						{ 'combination.talla': { $regex: new RegExp(filters.size, 'i') } },
						{ 'combination.Talla': { $regex: new RegExp(filters.size, 'i') } },
					],
				})
				.exec();
			const sizeProductIds = [...new Set(sizeVariants.map((v) => v.productId))];
			if (sizeProductIds.length > 0) {
				if (productIdConditions.length > 0) {
					// Si ya hay condiciones de color, hacer intersección
					const intersection = productIdConditions.filter((id) =>
						sizeProductIds.includes(id),
					);
					productIdConditions.length = 0;
					productIdConditions.push(...intersection);
				} else {
					productIdConditions.push(...sizeProductIds);
				}
			} else {
				// Si no hay variants con ese size, no hay productos que cumplan
				productIdConditions.length = 0;
				productIdConditions.push(''); // Esto hará que no se encuentre nada
			}
		}

		// Si hay condiciones de productIds, agregarlas al query
		if (productIdConditions.length > 0) {
			// Filtrar IDs vacíos (que indican que no hay coincidencias)
			const validProductIds = productIdConditions.filter((id) => id !== '');
			if (validProductIds.length > 0) {
				// Convertir a ObjectIds y agregar al query
				const objectIds = validProductIds.map((id) =>
					MongoIdUtils.stringToObjectId(id),
				);
				const existingIdFilter = query._id as
					| { $in?: Types.ObjectId[] }
					| undefined;
				if (existingIdFilter && Array.isArray(existingIdFilter.$in)) {
					// Si ya hay condición de _id, hacer intersección
					query._id = {
						$in: existingIdFilter.$in.filter((id: Types.ObjectId) =>
							objectIds.some((oid) => oid.toString() === id.toString()),
						),
					};
				} else {
					query._id = { $in: objectIds };
				}
			} else {
				// No hay productos que cumplan los filtros
				query._id = { $in: [] }; // Esto hará que no se encuentre nada
			}
		}
	}

	/**
	 * Construye los lookups para categoría, shop (nombre tienda) y community
	 */
	private buildCategoryAndSellerLookups(): PipelineStage[] {
		return [
			// Lookup para categoria
			{
				$lookup: {
					from: 'textilecategories',
					let: {
						catId: {
							$convert: {
								input: '$categoryId',
								to: 'objectId',
								onError: null,
								onNull: null,
							},
						},
					},
					pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$catId'] } } }],
					as: 'category',
				},
			},
			// Lookup para shop/productor (cuando ownerType es SHOP; nombre viene de la tienda)
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
			// Lookup para community/productor (cuando ownerType es COMMUNITY)
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

	/**
	 * Construye el procesamiento de opciones de color y lookup de ColorOptionAlternative
	 */
	private buildColorProcessingStages(): PipelineStage[] {
		return [
			// Procesar opciones de color
			{
				$addFields: {
					colorOptionIds: {
						$reduce: {
							input: {
								$filter: {
									input: '$options',
									as: 'opt',
									cond: {
										$or: [
											{ $eq: [{ $toLower: '$$opt.name' }, 'color'] },
											{ $eq: [{ $toLower: '$$opt.name' }, 'colour'] },
										],
									},
								},
							},
							initialValue: [],
							in: {
								$concatArrays: [
									'$$value',
									{
										$map: {
											input: '$$this.values',
											as: 'val',
											in: {
												id: '$$val.id',
												label: '$$val.label',
											},
										},
									},
								],
							},
						},
					},
				},
			},
			// Lookup para ColorOptionAlternative
			{
				$lookup: {
					from: 'coloroptionalternatives',
					let: { colorIds: '$colorOptionIds' },
					pipeline: [
						{
							$match: {
								$expr: {
									$in: [
										{ $toString: '$_id' },
										{
											$map: {
												input: '$$colorIds',
												as: 'c',
												in: '$$c.id',
											},
										},
									],
								},
							},
						},
					],
					as: 'colorAlternatives',
				},
			},
		];
	}

	/**
	 * Construye la proyección final del formato de respuesta
	 */
	private buildFinalProjection(): PipelineStage {
		return {
			$project: {
				_id: 0,
				id: '$_id',
				title: '$baseInfo.title',
				categoryName: {
					$ifNull: [{ $arrayElemAt: ['$category.name', 0] }, 'Sin categoría'],
				},
				productorName: {
					$cond: {
						if: { $gt: [{ $size: '$shop' }, 0] },
						then: { $arrayElemAt: ['$shop.name', 0] },
						else: {
							$cond: {
								if: { $gt: [{ $size: '$community' }, 0] },
								then: { $arrayElemAt: ['$community.name', 0] },
								else: 'Productor desconocido',
							},
						},
					},
				},
				principalImgUrl: {
					$ifNull: [{ $arrayElemAt: ['$baseInfo.mediaIds', 0] }, ''],
				},
				price: '$priceInventary.basePrice',
				colors: {
					$map: {
						input: '$colorOptionIds',
						as: 'colorOpt',
						in: {
							$let: {
								vars: {
									matchedColor: {
										$arrayElemAt: [
											{
												$filter: {
													input: '$colorAlternatives',
													as: 'alt',
													cond: {
														$eq: [{ $toString: '$$alt._id' }, '$$colorOpt.id'],
													},
												},
											},
											0,
										],
									},
								},
								in: {
									name: '$$colorOpt.label',
									colorHexCode: {
										$ifNull: ['$$matchedColor.hexCode', '#000000'],
									},
								},
							},
						},
					},
				},
				tallas: {
					$reduce: {
						input: {
							$let: {
								vars: {
									sizeOption: {
										$arrayElemAt: [
											{
												$filter: {
													input: { $ifNull: ['$options', []] },
													as: 'opt',
													cond: { $eq: ['$$opt.name', 'SIZE'] },
												},
											},
											0,
										],
									},
								},
								in: { $ifNull: ['$$sizeOption.values', []] },
							},
						},
						initialValue: [],
						in: {
							$setUnion: [
								'$$value',
								[{ $ifNull: [{ $toLower: '$$this.label' }, ''] }],
							],
						},
					},
				},
			},
		};
	}

	/**
	 * Construye la proyección base para el listado.
	 * Deja campos directos y options para enriquecer luego con el assembler.
	 */
	private buildListBaseProjection(): PipelineStage {
		return {
			$project: {
				_id: 0,
				id: { $toString: '$_id' },
				title: '$baseInfo.title',
				categoryName: {
					$ifNull: [{ $arrayElemAt: ['$category.name', 0] }, 'Sin categoría'],
				},
				productorName: {
					$cond: {
						if: { $gt: [{ $size: '$shop' }, 0] },
						then: { $arrayElemAt: ['$shop.name', 0] },
						else: {
							$cond: {
								if: { $gt: [{ $size: '$community' }, 0] },
								then: { $arrayElemAt: ['$community.name', 0] },
								else: 'Productor desconocido',
							},
						},
					},
				},
				principalImgUrl: {
					$ifNull: [{ $arrayElemAt: ['$baseInfo.mediaIds', 0] }, ''],
				},
				price: '$priceInventary.basePrice',
				totalStock: { $ifNull: ['$priceInventary.totalStock', 0] },
				options: { $ifNull: ['$options', []] },
			},
		};
	}

	/**
	 * Ejecuta una aggregation para contar y hacer lookup de documentos relacionados
	 */
	private async aggregateWithLookup(
		baseQuery: FilterQuery<TextileProductDocument>,
		sourceField: string,
		lookupCollection: string,
		labelField: string,
	): Promise<Array<{ label: string; count: number }>> {
		return await this.textileProductModel.aggregate([
			{ $match: baseQuery },
			{
				$match: {
					[sourceField]: { $exists: true, $ne: null },
				},
			},
			{
				$addFields: {
					objectId: {
						$convert: {
							input: `$${sourceField}`,
							to: 'objectId',
							onError: null,
							onNull: null,
						},
					},
				},
			},
			{
				$group: {
					_id: '$objectId',
					count: { $sum: 1 },
				},
			},
			{ $match: { _id: { $ne: null } } },
			{ $sort: { count: -1 } },
			{
				$lookup: {
					from: lookupCollection,
					localField: '_id',
					foreignField: '_id',
					as: 'doc',
				},
			},
			{ $unwind: { path: '$doc', preserveNullAndEmptyArrays: false } },
			{
				$project: {
					_id: 0,
					label: `$doc.${labelField}`,
					count: 1,
				},
			},
		]);
	}

	async getAllTextileProducts(): Promise<TextileProduct[]> {
		const docs = await this.textileProductModel.find().exec();
		return docs.map((doc) => TextileProductMapper.fromDocument(doc));
	}

	async getAllWithPagination(
		page: number,
		perPage: number,
	): Promise<{ products: TextileProduct[]; total: number }> {
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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { createdAt, ...updateData } = plain;
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.textileProductModel
			.findByIdAndUpdate(objectId, { $set: updateData }, { new: true })
			.exec();
		return TextileProductMapper.fromDocument(updated!);
	}

	async deleteTextileProduct(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.textileProductModel.findByIdAndDelete(objectId).exec();
		return;
	}

	async getFilterCounts(filters?: ProductFilters): Promise<FilterCount> {
		const baseQuery = this.buildBaseQuery(filters);

		// Aggregation para contar colores desde variants
		const colorAggregation = await this.aggregateVariantFieldForFilter(
			baseQuery,
			['color', 'Color'],
		);

		// Aggregation para contar tallas/sizes desde variants
		const sizeAggregation = await this.aggregateVariantFieldForFilter(
			baseQuery,
			['size', 'Size', 'talla', 'Talla'],
		);

		// Aggregation para contar comunidades
		const communityAggregation = await this.aggregateWithLookup(
			baseQuery,
			'detailTraceability.communityId',
			'communities',
			'name',
		);

		// Aggregation para contar categorías
		const categoryAggregation = await this.aggregateWithLookup(
			baseQuery,
			'categoryId',
			'textilecategories',
			'name',
		);

		const filterCount: FilterCount = {
			colors: colorAggregation.map((item) => ({
				label: item._id,
				count: item.count,
			})),
			sizes: sizeAggregation.map((item) => ({
				label: item._id,
				count: item.count,
			})),
			communities: communityAggregation.map((item) => ({
				label: item.label,
				count: item.count,
			})),
			categories: categoryAggregation.map((item) => ({
				label: item.label,
				count: item.count,
			})),
		};

		return filterCount;
	}

	/**
	 * Construye los stages de ordenamiento según el criterio especificado
	 * - LATEST: Ordena por fecha de creación (más reciente primero)
	 * - POPULAR: Ordena por cantidad de veces comprado (más popular primero)
	 */
	private buildSortStages(sortBy?: ProductSortBy): PipelineStage[] {
		if (!sortBy || sortBy === ProductSortBy.LATEST) {
			// Ordenar por fecha de creación, más reciente primero
			return [{ $sort: { createdAt: -1 } }];
		}

		if (sortBy === ProductSortBy.POPULAR) {
			// Lookup a Orders para contar ventas por productId desde items embebidos
			return [
				{
					$lookup: {
						from: 'orders',
						let: { productId: { $toString: '$_id' } },
						pipeline: [
							{
								$match: {
									'items.productId': { $toString: '$$productId' },
								},
							},
							{
								$unwind: '$items',
							},
							{
								$match: {
									$expr: {
										$eq: ['$items.productId', { $toString: '$$productId' }],
									},
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
				// Ordenar por cantidad vendida (más vendido primero), luego por fecha de creación
				{ $sort: { totalSold: -1, createdAt: -1 } },
			];
		}

		// Default: ordenar por fecha de creación
		return [{ $sort: { createdAt: -1 } }];
	}

	async getAllWithFilters(
		filters: ProductFilters,
	): Promise<{ products: TextileProductListItem[]; total: number }> {
		const query = this.buildBaseQuery(filters);

		// Aplicar filtros de variantes usando método modular
		await this.applyVariantFilters(query, filters);

		// Paginación
		const page = filters.page || 1;
		const perPage = filters.perPage || 10;
		const skip = (page - 1) * perPage;

		// Aggregation pipeline base para listado
		const pipeline: PipelineStage[] = [
			{ $match: query },
			...this.buildSortStages(filters.sortBy),
			...this.buildCategoryAndSellerLookups(),
			this.buildListBaseProjection(),
			{ $skip: skip },
			{ $limit: perPage },
		];

		const [rawProducts, countResult] = await Promise.all([
			this.textileProductModel.aggregate(pipeline).exec(),
			this.textileProductModel.countDocuments(query).exec(),
		]);

		const productIds = rawProducts.map((product: any) => product.id);
		const variantDocs =
			productIds.length > 0
				? await this.variantModel
						.find({ productId: { $in: productIds } })
						.exec()
				: [];
		const variants = variantDocs.map((doc) => VariantMapper.fromDocument(doc));

		const attributesByProductId =
			await this.textileProductAttributesAssembler.buildForProducts(
				rawProducts.map((product: any) => ({
					id: product.id,
					options: product.options,
				})),
				variants,
			);

		const products: TextileProductListItem[] = rawProducts.map(
			(product: any) => {
				const attrs = attributesByProductId.get(product.id) || {
					variantInfo: [],
				};
				const stock = product.totalStock ?? 0;

				return {
					id: product.id,
					title: product.title,
					categoryName: product.categoryName,
					productorName: product.productorName,
					principalImgUrl: product.principalImgUrl,
					price: product.price,
					variantInfo: attrs.variantInfo,
					stock,
				};
			},
		);

		return {
			products,
			total: countResult,
		};
	}

	async getByIds(ids: string[]): Promise<TextileProduct[]> {
		if (!ids.length) return [];
		const objectIds = ids.map((id) => MongoIdUtils.stringToObjectId(id));
		const docs = await this.textileProductModel
			.find({ _id: { $in: objectIds } })
			.exec();
		return docs.map((doc) => TextileProductMapper.fromDocument(doc));
	}

	async reduceStock(
		id: string,
		quantity: number,
	): Promise<TextileProduct | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.textileProductModel
			.findOneAndUpdate(
				{ _id: objectId, 'priceInventary.totalStock': { $gte: quantity } },
				{
					$inc: { 'priceInventary.totalStock': -quantity },
					$set: { updatedAt: new Date() },
				},
				{ new: true },
			)
			.exec();
		return updated ? TextileProductMapper.fromDocument(updated) : null;
	}
}
