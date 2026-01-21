import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../../app/datastore/Review.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewDocument } from '../persistence/Review.schema';
import { Review } from 'src/andean/domain/entities/Review';
import { ReviewMapper } from '../services/ReviewMapper';
import { MongoIdUtils } from '../utils/MongoIdUtils';
import { ProductType } from 'src/andean/domain/enums/ProductType';

@Injectable()
export class ReviewRepositoryImpl extends ReviewRepository {
	constructor(
		@InjectModel('Review')
		private readonly reviewModel: Model<ReviewDocument>,
	) {
		super();
	}

	async create(review: Review): Promise<Review> {
		const plain = ReviewMapper.toPersistence(review);
		const created = new this.reviewModel(plain);
		const savedReview = await created.save();
		return ReviewMapper.fromDocument(savedReview);
	}

	async getAll(): Promise<Review[]> {
		const docs = await this.reviewModel.find().exec();
		return docs.map((doc) => ReviewMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<Review | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.reviewModel.findById(objectId).exec();
		return doc ? ReviewMapper.fromDocument(doc) : null;
	}

	async update(id: string, review: Review): Promise<Review> {
		const plain = ReviewMapper.toPersistence(review);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.reviewModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return ReviewMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.reviewModel.findByIdAndDelete(objectId).exec();
		return;
	}

	async getByProductIdAndType(productId: string, productType: ProductType): Promise<Review[]> {
		const docs = await this.reviewModel
			.find({ productId, productType })
			.exec();
		return docs.map((doc) => ReviewMapper.fromDocument(doc));
	}

	async incrementLikes(id: string): Promise<Review> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.reviewModel
			.findByIdAndUpdate(
				objectId,
				{ $inc: { numberLikes: 1 }, $set: { updatedAt: new Date() } },
				{ new: true },
			)
			.exec();
		if (!updated) {
			throw new Error('Review not found');
		}
		return ReviewMapper.fromDocument(updated);
	}

	async incrementDislikes(id: string): Promise<Review> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.reviewModel
			.findByIdAndUpdate(
				objectId,
				{ $inc: { numberDislikes: 1 }, $set: { updatedAt: new Date() } },
				{ new: true },
			)
			.exec();
		if (!updated) {
			throw new Error('Review not found');
		}
		return ReviewMapper.fromDocument(updated);
	}

	async decrementLikes(id: string): Promise<Review> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.reviewModel
			.findByIdAndUpdate(
				objectId,
				{ $inc: { numberLikes: -1 }, $set: { updatedAt: new Date() } },
				{ new: true },
			)
			.exec();
		if (!updated) {
			throw new Error('Review not found');
		}
		return ReviewMapper.fromDocument(updated);
	}

	async decrementDislikes(id: string): Promise<Review> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.reviewModel
			.findByIdAndUpdate(
				objectId,
				{ $inc: { numberDislikes: -1 }, $set: { updatedAt: new Date() } },
				{ new: true },
			)
			.exec();
		if (!updated) {
			throw new Error('Review not found');
		}
		return ReviewMapper.fromDocument(updated);
	}
}
