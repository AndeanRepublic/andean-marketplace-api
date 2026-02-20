import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceDetailInfoRepository } from '../../../datastore/experiences/ExperienceDetailInfo.repo';
import { ExperienceDetailInfo } from 'src/andean/domain/entities/experiences/ExperienceDetailInfo';
import { ExperienceDetailInfoDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';

@Injectable()
export class UpdateExperienceDetailInfoUseCase {
	constructor(
		@Inject(ExperienceDetailInfoRepository)
		private readonly repo: ExperienceDetailInfoRepository,
	) { }

	async handle(
		id: string,
		dto: ExperienceDetailInfoDto,
	): Promise<ExperienceDetailInfo> {
		const existing = await this.repo.getById(id);
		if (!existing) {
			throw new NotFoundException('ExperienceDetailInfo not found');
		}

		const updatedData: Partial<ExperienceDetailInfo> = {
			...existing,
			...dto,
		};

		return this.repo.update(id, updatedData);
	}
}
