import { instanceToPlain } from 'class-transformer';
import { Types } from 'mongoose';
import { Box, BoxProduct } from '../../../domain/entities/box/Box';
import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { BoxDocument } from '../../persistence/box/box.schema';
import { CreateBoxDto } from '../../controllers/dto/box/CreateBoxDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

export class BoxMapper {
	static fromDocument(doc: BoxDocument): Box {
		const plain = doc.toObject();
		const products = (plain.products ?? []).map(
			(p) =>
				new BoxProduct(
					p.productType as BoxProductType,
					p.productId,
					p.variantId,
					p.boxPrice,
					p.narrativeImgId,
				),
		);

		const id = MongoIdUtils.objectIdToString(doc._id as Types.ObjectId);
		const status =
			plain.status === AdminEntityStatus.PUBLISHED
				? AdminEntityStatus.PUBLISHED
				: AdminEntityStatus.HIDDEN;

		return new Box(
			id,
			plain.name,
			plain.slogan,
			plain.narrative,
			plain.thumbnailImageId,
			plain.mainImageId,
			products,
			status,
			plain.price,
			plain.discountPercentage,
			plain.sealIds ?? [],
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateBoxDto): Box {
		const id = new Types.ObjectId().toString();
		const products = (dto.products ?? []).map(
			(p) =>
				new BoxProduct(
					p.productType,
					p.productId,
					p.variantId,
					p.boxPrice,
					p.narrativeImgId,
				),
		);
		const now = new Date();
		return new Box(
			id,
			dto.name,
			dto.slogan,
			dto.narrative,
			dto.thumbnailImageId,
			dto.mainImageId,
			products,
			AdminEntityStatus.HIDDEN,
			dto.price,
			dto.discountPercentage,
			dto.sealIds ?? [],
			now,
			now,
		);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateBoxDto,
		existing: Box,
	): Box {
		const products = (dto.products ?? []).map(
			(p) =>
				new BoxProduct(
					p.productType,
					p.productId,
					p.variantId,
					p.boxPrice,
					p.narrativeImgId,
				),
		);
		const now = new Date();
		return new Box(
			id,
			dto.name,
			dto.slogan,
			dto.narrative,
			dto.thumbnailImageId,
			dto.mainImageId,
			products,
			existing.status,
			dto.price,
			dto.discountPercentage,
			dto.sealIds ?? [],
			existing.createdAt,
			now,
		);
	}

	static toPersistence(box: Box | Partial<Box>) {
		const plain = instanceToPlain(box);
		const { id, _id, __v, ...dataForDB } = plain;
		return dataForDB;
	}
}
