import { ExperienceBasicInfo } from 'src/andean/domain/entities/experiences/ExperienceBasicInfo';
import { ExperienceBasicInfoDocument } from '../../persistence/experiences/experienceBasicInfo.schema';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

export class ExperienceBasicInfoMapper {
	static fromDocument(doc: ExperienceBasicInfoDocument): ExperienceBasicInfo {
		const plain = doc.toObject();
		return plainToInstance(ExperienceBasicInfo, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: any): ExperienceBasicInfo {
		const plain = {
			id: new Types.ObjectId().toString(),
			...dto,
		};
		return plainToInstance(ExperienceBasicInfo, plain);
	}

	static fromUpdateDto(id: string, dto: any): ExperienceBasicInfo {
		const plain = {
			id,
			...dto,
		};
		return plainToInstance(ExperienceBasicInfo, plain);
	}

	static toPersistence(
		entity: ExperienceBasicInfo | Partial<ExperienceBasicInfo>,
	) {
		const plain = instanceToPlain(entity);
		const { id, _id, __v, ...dataForDB } = plain;
		return dataForDB;
	}
}
