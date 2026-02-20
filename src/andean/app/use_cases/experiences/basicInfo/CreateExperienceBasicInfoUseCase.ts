import { Inject, Injectable } from '@nestjs/common';
import { ExperienceBasicInfoRepository } from '../../../datastore/experiences/ExperienceBasicInfo.repo';
import { ExperienceBasicInfo } from 'src/andean/domain/entities/experiences/ExperienceBasicInfo';
import { ExperienceBasicInfoMapper } from 'src/andean/infra/services/experiences/ExperienceBasicInfoMapper';
import { ExperienceBasicInfoDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';
import {
	OwnerStrategyResolver,
} from 'src/andean/infra/services/experiences/OwnerStrategyResolver';

@Injectable()
export class CreateExperienceBasicInfoUseCase {
	constructor(
		@Inject(ExperienceBasicInfoRepository)
		private readonly repo: ExperienceBasicInfoRepository,
		private readonly ownerStrategyResolver: OwnerStrategyResolver,
	) { }

	async handle(dto: ExperienceBasicInfoDto): Promise<ExperienceBasicInfo> {
		const strategy = this.ownerStrategyResolver.resolve(dto.ownerType);
		await strategy.validate(dto.ownerId);

		const entity = ExperienceBasicInfoMapper.fromCreateDto(dto);
		return this.repo.save(entity);
	}
}
