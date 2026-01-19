import { TextileCertificationDocument } from '../../persistence/textileProducts/textileCertification.schema';
import { TextileCertification } from '../../../domain/entities/textileProducts/TextileCertification';
import { CreateTextileCertificationDto } from '../../controllers/dto/textileProducts/CreateTextileCertificationDto';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { Types } from 'mongoose';

export class TextileCertificationMapper {
	static fromDocument(doc: TextileCertificationDocument): TextileCertification {
		const plain = doc.toObject();
		return plainToInstance(TextileCertification, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(
		dto: CreateTextileCertificationDto,
	): TextileCertification {
		const { ...textileCertificationData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...textileCertificationData,
		};
		return plainToInstance(TextileCertification, plain);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateTextileCertificationDto,
	): TextileCertification {
		const { ...textileCertificationData } = dto;
		const plain = {
			id: id,
			...textileCertificationData,
		};
		return plainToInstance(TextileCertification, plain);
	}

	static toPersistence(textileCertification: TextileCertification) {
		const plain = instanceToPlain(textileCertification);
		const { id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
