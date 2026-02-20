import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	ExperienceRepository,
	ExperienceFilters,
	ExperienceListRawItem,
} from '../../../app/datastore/experiences/Experience.repo';
import { Experience } from 'src/andean/domain/entities/experiences/Experience';
import { ExperienceDocument } from '../../persistence/experiences/experience.schema';
import { ExperienceMapper } from '../../services/experiences/ExperienceMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';

@Injectable()
export class ExperienceRepositoryImpl extends ExperienceRepository {
	constructor(
		@InjectModel('Experience')
		private readonly model: Model<ExperienceDocument>,
	) {
		super();
	}

	async getAll(): Promise<Experience[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => ExperienceMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<Experience | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? ExperienceMapper.fromDocument(doc) : null;
	}

	async save(entity: Experience): Promise<Experience> {
		const plain = ExperienceMapper.toPersistence(entity);
		const created = new this.model(plain);
		const saved = await created.save();
		return ExperienceMapper.fromDocument(saved);
	}

	async update(
		id: string,
		entity: Partial<Experience>,
	): Promise<Experience> {
		const plain = ExperienceMapper.toPersistence(entity);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.model
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return ExperienceMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}

	async getAllWithFilters(
		filters: ExperienceFilters,
	): Promise<{ items: ExperienceListRawItem[]; total: number }> {
		const page = filters.page || 1;
		const perPage = filters.perPage || 20;

		const pipeline: any[] = [
			// 1. Lookup BasicInfo
			{
				$addFields: {
					basicInfoOid: { $toObjectId: '$basicInfoId' },
				},
			},
			{
				$lookup: {
					from: 'experiencebasicinfos',
					localField: 'basicInfoOid',
					foreignField: '_id',
					as: 'basicInfo',
				},
			},
			{ $unwind: '$basicInfo' },

			// 2. Apply category filter
			...(filters.category
				? [{ $match: { 'basicInfo.category': filters.category } }]
				: []),

			// 3. Apply ownerId filter
			...(filters.ownerId
				? [{ $match: { 'basicInfo.ownerId': filters.ownerId } }]
				: []),

			// 4. Lookup Prices
			{
				$addFields: {
					pricesOid: { $toObjectId: '$pricesId' },
				},
			},
			{
				$lookup: {
					from: 'experienceprices',
					localField: 'pricesOid',
					foreignField: '_id',
					as: 'prices',
				},
			},
			{ $unwind: '$prices' },

			// 5. Extract ADULTS price
			{
				$addFields: {
					adultsPrice: {
						$let: {
							vars: {
								adultsGroup: {
									$arrayElemAt: [
										{
											$filter: {
												input: '$prices.ageGroups',
												as: 'ag',
												cond: {
													$eq: ['$$ag.code', AgeGroupCode.ADULTS],
												},
											},
										},
										0,
									],
								},
							},
							in: { $ifNull: ['$$adultsGroup.price', 0] },
						},
					},
				},
			},

			// 6. Apply price filters
			...(filters.minPrice !== undefined
				? [{ $match: { adultsPrice: { $gte: filters.minPrice } } }]
				: []),
			...(filters.maxPrice !== undefined
				? [{ $match: { adultsPrice: { $lte: filters.maxPrice } } }]
				: []),

			// 7. Lookup MediaInfo
			{
				$addFields: {
					mediaInfoOid: { $toObjectId: '$mediaInfoId' },
				},
			},
			{
				$lookup: {
					from: 'experiencemediainfos',
					localField: 'mediaInfoOid',
					foreignField: '_id',
					as: 'mediaInfo',
				},
			},
			{ $unwind: '$mediaInfo' },

			// 8. Lookup MediaItem for landscapeImg
			{
				$addFields: {
					landscapeImgOid: { $toObjectId: '$mediaInfo.landscapeImg' },
				},
			},
			{
				$lookup: {
					from: 'mediaitems',
					localField: 'landscapeImgOid',
					foreignField: '_id',
					as: 'mainImageData',
				},
			},
			{
				$unwind: {
					path: '$mainImageData',
					preserveNullAndEmptyArrays: true,
				},
			},

			// 9. Lookup Community for ownerName
			{
				$addFields: {
					ownerOid: { $toObjectId: '$basicInfo.ownerId' },
				},
			},
			{
				$lookup: {
					from: 'communities',
					localField: 'ownerOid',
					foreignField: '_id',
					as: 'ownerData',
				},
			},
			{
				$unwind: {
					path: '$ownerData',
					preserveNullAndEmptyArrays: true,
				},
			},

			// 10. Sort by most recent
			{ $sort: { createdAt: -1 as const } },

			// 11. Facet for pagination
			{
				$facet: {
					metadata: [{ $count: 'total' }],
					data: [
						{ $skip: (page - 1) * perPage },
						{ $limit: perPage },
						{
							$project: {
								_id: 1,
								title: '$basicInfo.title',
								ownerName: {
									$ifNull: ['$ownerData.name', ''],
								},
								adultsPrice: 1,
								ubication: '$basicInfo.ubication',
								days: '$basicInfo.days',
								mainImageName: {
									$ifNull: ['$mainImageData.name', ''],
								},
								mainImageUrl: {
									$ifNull: ['$mainImageData.key', ''],
								},
							},
						},
					],
				},
			},
		];

		const [result] = await this.model.aggregate(pipeline).exec();

		const total = result.metadata[0]?.total || 0;
		const items: ExperienceListRawItem[] = result.data.map((doc: any) => ({
			id: doc._id.toString(),
			title: doc.title,
			ownerName: doc.ownerName,
			adultsPrice: doc.adultsPrice,
			ubication: doc.ubication,
			days: doc.days,
			mainImageName: doc.mainImageName,
			mainImageUrl: doc.mainImageUrl,
		}));

		return { items, total };
	}
}
