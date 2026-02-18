import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceBasicInfoRepository } from '../../../datastore/experiences/ExperienceBasicInfo.repo';
import { ExperienceBasicInfo } from 'src/andean/domain/entities/experiences/ExperienceBasicInfo';
import { ExperienceBasicInfoDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';
import { OwnerStrategyResolver } from 'src/andean/infra/services/experiences/OwnerStrategyResolver';

@Injectable()
export class UpdateExperienceBasicInfoUseCase {
	constructor(
		@Inject(ExperienceBasicInfoRepository)
		private readonly repo: ExperienceBasicInfoRepository,
		private readonly ownerStrategyResolver: OwnerStrategyResolver,
	) { }

	async handle(
		id: string,
		dto: ExperienceBasicInfoDto,
	): Promise<ExperienceBasicInfo> {
		const existing = await this.repo.getById(id);
		if (!existing) {
			throw new NotFoundException('ExperienceBasicInfo not found');
		}

		if (dto.ownerType && dto.ownerId) {
			const strategy = this.ownerStrategyResolver.resolve(dto.ownerType);
			await strategy.validate(dto.ownerId);
		}

		const updatedData: Partial<ExperienceBasicInfo> = {
			...existing,
			...dto,
		};

		return this.repo.update(id, updatedData);
	}
}
