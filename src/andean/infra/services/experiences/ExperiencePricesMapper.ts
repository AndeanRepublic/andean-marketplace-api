import { ExperiencePrices } from 'src/andean/domain/entities/experiences/ExperiencePrices';
import { ExperiencePricesDocument } from '../../persistence/experiences/experiencePrices.schema';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { AgeGroup } from 'src/andean/domain/entities/experiences/AgeGroup';

export class ExperiencePricesMapper {
	static fromDocument(doc: ExperiencePricesDocument): ExperiencePrices {
		const plain = doc.toObject();
		const ageGroups = (plain.ageGroups || []).map((ag: any) =>
			plainToInstance(AgeGroup, {
				code: ag.code,
				label: ag.label,
				price: ag.price,
				minAge: ag.minAge,
				maxAge: ag.maxAge,
			}),
		);

		return plainToInstance(ExperiencePrices, {
			id: plain._id.toString(),
			useAgeBasedPricing: plain.useAgeBasedPricing,
			currency: plain.currency,
			ageGroups,
		});
	}

	static fromCreateDto(dto: any): ExperiencePrices {
		const ageGroups = (dto.ageGroups || []).map((ag: any) =>
			plainToInstance(AgeGroup, ag),
		);

		const plain = {
			id: new Types.ObjectId().toString(),
			useAgeBasedPricing: dto.useAgeBasedPricing,
			currency: dto.currency,
			ageGroups,
		};
		return plainToInstance(ExperiencePrices, plain);
	}

	static fromUpdateDto(id: string, dto: any): ExperiencePrices {
		const ageGroups = (dto.ageGroups || []).map((ag: any) =>
			plainToInstance(AgeGroup, ag),
		);

		const plain = {
			id,
			useAgeBasedPricing: dto.useAgeBasedPricing,
			currency: dto.currency,
			ageGroups,
		};
		return plainToInstance(ExperiencePrices, plain);
	}

	static toPersistence(entity: ExperiencePrices | Partial<ExperiencePrices>) {
		const plain = instanceToPlain(entity);
		const { id: _id1, _id: _id2, __v: _v, ...dataForDB } = plain;
		return dataForDB;
	}
}
