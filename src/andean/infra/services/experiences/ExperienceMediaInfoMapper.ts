import { ExperienceMediaInfo } from 'src/andean/domain/entities/experiences/ExperienceMediaInfo';
import { ExperienceMediaInfoDocument } from '../../persistence/experiences/experienceMediaInfo.schema';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

export class ExperienceMediaInfoMapper {
	static fromDocument(doc: ExperienceMediaInfoDocument): ExperienceMediaInfo {
		const plain = doc.toObject();
		return plainToInstance(ExperienceMediaInfo, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: any): ExperienceMediaInfo {
		const plain = {
			id: new Types.ObjectId().toString(),
			...dto,
		};
		return plainToInstance(ExperienceMediaInfo, plain);
	}

	static fromUpdateDto(id: string, dto: any): ExperienceMediaInfo {
		const plain = {
			id,
			...dto,
		};
		return plainToInstance(ExperienceMediaInfo, plain);
	}

	static toPersistence(
		entity: ExperienceMediaInfo | Partial<ExperienceMediaInfo>,
	) {
		const plain = instanceToPlain(entity);
		const { id, _id, __v, ...dataForDB } = plain;
		return dataForDB;
	}
}
