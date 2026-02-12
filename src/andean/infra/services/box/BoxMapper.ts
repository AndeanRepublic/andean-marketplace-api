import { plainToInstance, instanceToPlain } from 'class-transformer';
import { Types } from 'mongoose';
import { Box, BoxProduct } from '../../../domain/entities/box/Box';
import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { BoxDocument } from '../../persistence/box/box.schema';
import { CreateBoxDto } from '../../controllers/dto/box/CreateBoxDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

export class BoxMapper {
	static fromDocument(doc: BoxDocument): Box {
		const plain = doc.toObject();
		const products = (plain.products || []).map(
			(p: any) => new BoxProduct(p.productType as BoxProductType, p.productId, p.variantId),
		);
		return new Box(
			MongoIdUtils.objectIdToString(plain._id),
			plain.title,
			plain.subtitle,
			plain.description,
			plain.thumbnailImageId,
			plain.mainImageId,
			products,
			plain.price,
			plain.sealIds || [],
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateBoxDto): Box {
		const id = new Types.ObjectId().toString();
		const products = (dto.products || []).map(
			(p) => new BoxProduct(p.productType as BoxProductType, p.productId, p.variantId),
		);
		const now = new Date();
		return new Box(
			id,
			dto.title,
			dto.subtitle,
			dto.description,
			dto.thumbnailImageId,
			dto.mainImageId,
			products,
			dto.price,
			dto.sealIds || [],
			now,
			now,
		);
	}

	static toPersistence(box: Box | Partial<Box>) {
		const plain = instanceToPlain(box);
		const { id, _id, __v, ...dataForDB } = plain;
		return dataForDB;
	}
}
