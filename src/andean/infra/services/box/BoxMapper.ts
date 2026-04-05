import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { Box, BoxProduct } from '../../../domain/entities/box/Box';
import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { BoxDocument } from '../../persistence/box/box.schema';
import { CreateBoxDto } from '../../controllers/dto/box/CreateBoxDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

export class BoxMapper {
	static fromDocument(doc: BoxDocument): Box {
		const plain = doc.toObject();
		const products = (doc.products ?? []).map(
			(p) =>
				plainToInstance(BoxProduct, {
					...p,
					productType: p.productType as BoxProductType,
				}) as BoxProduct,
		);

		return plainToInstance(Box, {
			...plain,
			id: MongoIdUtils.objectIdToString(doc._id as Types.ObjectId),
			products,
		} as Box);
	}

	static fromCreateDto(dto: CreateBoxDto): Box {
		const { ...boxData } = dto;
		const id = new Types.ObjectId().toString();
		const products = (dto.products || []).map(
			(p) =>
				plainToInstance(BoxProduct, {
					...p,
					productType: p.productType as BoxProductType,
				}) as BoxProduct,
		);
		const now = new Date();
		return plainToInstance(Box, {
			...boxData,
			id: id,
			products,
			createdAt: now,
			updatedAt: now,
		} as Box);
	}

	static toPersistence(box: Box | Partial<Box>) {
		const plain = instanceToPlain(box);
		const { id, _id, __v, ...dataForDB } = plain;
		return dataForDB;
	}
}
