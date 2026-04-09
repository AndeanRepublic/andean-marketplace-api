import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { BoxRepository } from '../../../app/datastore/box/Box.repo';
import { Box } from '../../../domain/entities/box/Box';
import { BoxDocument } from '../../persistence/box/box.schema';
import { BoxMapper } from '../../services/box/BoxMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

@Injectable()
export class BoxRepoImpl extends BoxRepository {
	constructor(
		@InjectModel('Box') private readonly boxModel: Model<BoxDocument>,
	) {
		super();
	}

	async create(box: Box): Promise<Box> {
		const data = BoxMapper.toPersistence(box);
		const created = new this.boxModel(data);
		const saved = await created.save();
		return BoxMapper.fromDocument(saved);
	}

	async getById(id: string): Promise<Box | null> {
		try {
			const objectId = MongoIdUtils.stringToObjectId(id);
			const doc = await this.boxModel.findById(objectId).exec();
			return doc ? BoxMapper.fromDocument(doc) : null;
		} catch {
			return null;
		}
	}

	async getAll(page: number, perPage: number): Promise<{ data: Box[]; total: number }> {
		const skip = (page - 1) * perPage;
		const [docs, total] = await Promise.all([
			this.boxModel.find().skip(skip).limit(perPage).exec(),
			this.boxModel.countDocuments().exec(),
		]);
		const data = docs.map((doc) => BoxMapper.fromDocument(doc));
		return { data, total };
	}

	/** Colección de variantes en Mongo (modelo Mongoose `Variant`). */
	private static readonly VARIANT_COLLECTION = 'variants';

	async getIdsPageWithPositiveFulfillableStock(
		page: number,
		perPage: number,
	): Promise<{ items: { id: string; fulfillableQuantity: number }[]; total: number }> {
		const skip = Math.max(0, (page - 1) * perPage);
		const limit = Math.max(1, perPage);

		const pipeline: PipelineStage[] = [
			{
				$addFields: {
					__linesWithVariant: {
						$filter: {
							input: '$products',
							as: 'p',
							cond: {
								$and: [
									{ $ne: ['$$p.variantId', null] },
									{ $ne: ['$$p.variantId', ''] },
								],
							},
						},
					},
				},
			},
			{ $unwind: { path: '$__linesWithVariant' } },
			{
				$lookup: {
					from: BoxRepoImpl.VARIANT_COLLECTION,
					let: { vid: '$__linesWithVariant.variantId' },
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: [
										'$_id',
										{
											$convert: {
												input: '$$vid',
												to: 'objectId',
												onError: null,
												onNull: null,
											},
										},
									],
								},
							},
						},
					],
					as: '__variantHit',
				},
			},
			{
				$addFields: {
					__lineStock: {
						$max: [
							0,
							{
								$floor: {
									$ifNull: [{ $arrayElemAt: ['$__variantHit.stock', 0] }, 0],
								},
							},
						],
					},
				},
			},
			{
				$group: {
					_id: '$_id',
					stocks: { $push: '$__lineStock' },
					createdAt: { $first: '$createdAt' },
				},
			},
			{
				$addFields: {
					fulfillableQuantity: {
						$cond: [
							{ $eq: [{ $size: '$stocks' }, 3] },
							{ $min: '$stocks' },
							0,
						],
					},
				},
			},
			{ $match: { fulfillableQuantity: { $gt: 0 } } },
			{
				$facet: {
					meta: [{ $count: 'total' }],
					data: [
						{ $sort: { createdAt: -1 } },
						{ $skip: skip },
						{ $limit: limit },
						{
							$project: {
								_id: 1,
								fulfillableQuantity: 1,
							},
						},
					],
				},
			},
		];

		const agg = await this.boxModel.aggregate(pipeline).exec();
		const row = agg[0] as
			| {
					meta: { total: number }[];
					data: { _id: { toString: () => string }; fulfillableQuantity: number }[];
			  }
			| undefined;

		const total = row?.meta?.[0]?.total ?? 0;
		const items =
			row?.data?.map((d) => ({
				id: d._id.toString(),
				fulfillableQuantity: d.fulfillableQuantity,
			})) ?? [];

		return { items, total };
	}

	async getByIdsInOrder(ids: string[]): Promise<Box[]> {
		if (!ids.length) return [];
		const objectIds: ReturnType<typeof MongoIdUtils.stringToObjectId>[] = [];
		for (const id of ids) {
			try {
				objectIds.push(MongoIdUtils.stringToObjectId(id));
			} catch {
				/* id inválido: se omite del find; el orden final lo filtra */
			}
		}
		if (!objectIds.length) return [];
		const docs = await this.boxModel.find({ _id: { $in: objectIds } }).exec();
		const byId = new Map(
			docs.map((d) => [d._id.toString(), BoxMapper.fromDocument(d)]),
		);
		return ids.map((id) => byId.get(id)).filter((b): b is Box => Boolean(b));
	}

	async update(box: Box): Promise<Box> {
		const objectId = MongoIdUtils.stringToObjectId(box.id);
		const persistenceData = BoxMapper.toPersistence(box);
		persistenceData.updatedAt = box.updatedAt;
		const updatedDoc = await this.boxModel
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();
		if (!updatedDoc) {
			throw new Error('Box not found for update');
		}
		return BoxMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.boxModel.findByIdAndDelete(objectId).exec();
	}

	async updateStatus(id: string, status: AdminEntityStatus): Promise<Box | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.boxModel
			.findByIdAndUpdate(objectId, { $set: { status, updatedAt: new Date() } }, { new: true })
			.exec();
		return updated ? BoxMapper.fromDocument(updated) : null;
	}
}
