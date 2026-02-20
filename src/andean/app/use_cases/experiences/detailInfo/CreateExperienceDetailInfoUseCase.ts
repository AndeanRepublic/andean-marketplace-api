import { Inject, Injectable } from '@nestjs/common';
import { ExperienceDetailInfoRepository } from '../../../datastore/experiences/ExperienceDetailInfo.repo';
import { ExperienceDetailInfo } from 'src/andean/domain/entities/experiences/ExperienceDetailInfo';
import { ExperienceDetailInfoMapper } from 'src/andean/infra/services/experiences/ExperienceDetailInfoMapper';
import { ExperienceDetailInfoDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';

@Injectable()
export class CreateExperienceDetailInfoUseCase {
	constructor(
		@Inject(ExperienceDetailInfoRepository)
		private readonly repo: ExperienceDetailInfoRepository,
	) { }

	async handle(dto: ExperienceDetailInfoDto): Promise<ExperienceDetailInfo> {
		const entity = ExperienceDetailInfoMapper.fromCreateDto(dto);
		return this.repo.save(entity);
	}
}
