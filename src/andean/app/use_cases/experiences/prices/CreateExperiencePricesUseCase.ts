import { Inject, Injectable } from '@nestjs/common';
import { ExperiencePricesRepository } from '../../../datastore/experiences/ExperiencePrices.repo';
import { ExperiencePrices } from 'src/andean/domain/entities/experiences/ExperiencePrices';
import { ExperiencePricesMapper } from 'src/andean/infra/services/experiences/ExperiencePricesMapper';
import { ExperiencePricesDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';

@Injectable()
export class CreateExperiencePricesUseCase {
	constructor(
		@Inject(ExperiencePricesRepository)
		private readonly repo: ExperiencePricesRepository,
	) {}

	async handle(dto: ExperiencePricesDto): Promise<ExperiencePrices> {
		const entity = ExperiencePricesMapper.fromCreateDto(dto);
		return this.repo.save(entity);
	}
}
