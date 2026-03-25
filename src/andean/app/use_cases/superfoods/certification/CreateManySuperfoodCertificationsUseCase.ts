import { Injectable } from '@nestjs/common';
import { SuperfoodCertificationRepository } from '../../../datastore/superfoods/SuperfoodCertification.repo';
import { CreateManySuperfoodCertificationsDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodCertificationsDto';
import { SuperfoodCertificationResponse } from '../../../models/superfoods/SuperfoodCertificationResponse';
import { SuperfoodCertificationMapper } from '../../../../infra/services/superfood/SuperfoodCertificationMapper';

@Injectable()
export class CreateManySuperfoodCertificationsUseCase {
	constructor(
		private readonly certificationRepository: SuperfoodCertificationRepository,
	) {}

	async handle(
		dto: CreateManySuperfoodCertificationsDto,
	): Promise<SuperfoodCertificationResponse[]> {
		const certificationsToSave = dto.superfoodCertifications.map((itemDto) =>
			SuperfoodCertificationMapper.fromCreateDto(itemDto),
		);
		const savedCertifications =
			await this.certificationRepository.saveMany(certificationsToSave);
		return savedCertifications.map((certification) =>
			SuperfoodCertificationMapper.toResponse(certification),
		);
	}
}
