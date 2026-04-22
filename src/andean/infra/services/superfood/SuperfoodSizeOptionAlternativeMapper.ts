import { Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { SizeOptionAlternative } from '../../../domain/entities/superfoods/SizeOptionAlternative';
import { SuperfoodSizeOptionAlternativeDocument } from '../../persistence/superfood/superfoodSizeOptionAlternative.schema';

export class SuperfoodSizeOptionAlternativeMapper {
	static fromDocument(
		doc: SuperfoodSizeOptionAlternativeDocument,
	): SizeOptionAlternative {
		const plain = doc.toObject();
		return plainToInstance(SizeOptionAlternative, {
			id: plain._id.toString(),
			nameLabel: plain.nameLabel,
			sizeNumber: plain.sizeNumber,
			sizeUnit: plain.sizeUnit,
			servingsPerContainer: plain.servingsPerContainer,
		});
	}

	static fromInput(input: {
		sizeNumber: number;
		sizeUnit: 'g' | 'mg' | 'kg';
		servingsPerContainer: number;
	}): SizeOptionAlternative {
		return plainToInstance(SizeOptionAlternative, {
			id: new Types.ObjectId().toString(),
			nameLabel: `${input.sizeNumber} ${input.sizeUnit}`,
			sizeNumber: input.sizeNumber,
			sizeUnit: input.sizeUnit,
			servingsPerContainer: input.servingsPerContainer,
		});
	}

	static toPersistence(sizeOptionAlternative: SizeOptionAlternative) {
		return {
			nameLabel: `${sizeOptionAlternative.sizeNumber} ${sizeOptionAlternative.sizeUnit}`,
			sizeNumber: sizeOptionAlternative.sizeNumber,
			sizeUnit: sizeOptionAlternative.sizeUnit,
			servingsPerContainer: sizeOptionAlternative.servingsPerContainer,
		};
	}
}
