import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperiencePricesRepository } from '../../../datastore/experiences/ExperiencePrices.repo';
import { ExperiencePrices } from 'src/andean/domain/entities/experiences/ExperiencePrices';
import { ExperiencePricesDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';

@Injectable()
export class UpdateExperiencePricesUseCase {
	constructor(
		@Inject(ExperiencePricesRepository)
		private readonly repo: ExperiencePricesRepository,
	) {}

	async handle(
		id: string,
		dto: ExperiencePricesDto,
	): Promise<ExperiencePrices> {
		const existing = await this.repo.getById(id);
		if (!existing) {
			throw new NotFoundException('ExperiencePrices not found');
		}

		const updatedData: Partial<ExperiencePrices> = {
			...existing,
			...dto,
		};

		return this.repo.update(id, updatedData);
	}
}
