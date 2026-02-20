import { ExperienceDetailInfo } from 'src/andean/domain/entities/experiences/ExperienceDetailInfo';
import { ExperienceDetailInfoDocument } from '../../persistence/experiences/experienceDetailInfo.schema';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

export class ExperienceDetailInfoMapper {
	static fromDocument(
		doc: ExperienceDetailInfoDocument,
	): ExperienceDetailInfo {
		const plain = doc.toObject();
		return plainToInstance(ExperienceDetailInfo, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: any): ExperienceDetailInfo {
		const plain = {
			id: new Types.ObjectId().toString(),
			...dto,
		};
		return plainToInstance(ExperienceDetailInfo, plain);
	}

	static fromUpdateDto(id: string, dto: any): ExperienceDetailInfo {
		const plain = {
			id,
			...dto,
		};
		return plainToInstance(ExperienceDetailInfo, plain);
	}

	static toPersistence(
		entity: ExperienceDetailInfo | Partial<ExperienceDetailInfo>,
	) {
		const plain = instanceToPlain(entity);
		const { id, _id, __v, ...dataForDB } = plain;
		return dataForDB;
	}
}
