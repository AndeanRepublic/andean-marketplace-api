import { Review } from 'src/andean/domain/entities/Review';
import { ReviewDocument } from '../persistence/Review.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateReviewDto } from '../controllers/dto/CreateReviewDto';
import { Types } from 'mongoose';

export class ReviewMapper {
	static fromDocument(doc: ReviewDocument): Review {
		const plain = doc.toObject();
		return plainToInstance(Review, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: CreateReviewDto): Review {
		const { ...reviewData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...reviewData,
			numberLikes: reviewData.numberLikes || 0,
			numberDislikes: reviewData.numberDislikes || 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		return plainToInstance(Review, plain);
	}

	static fromUpdateDto(id: string, dto: CreateReviewDto): Review {
		const { ...reviewData } = dto;
		const plain = {
			id: id,
			...reviewData,
			numberLikes: reviewData.numberLikes || 0,
			numberDislikes: reviewData.numberDislikes || 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		return plainToInstance(Review, plain);
	}

	static toPersistence(review: Review) {
		const plain = instanceToPlain(review);
		const { id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
