import { Injectable } from '@nestjs/common';
import { SuperfoodCertificationRepository } from '../../../datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodCertification } from '../../../../domain/entities/superfoods/SuperfoodCertification';
import { SuperfoodCertificationResponse } from '../../../models/superfoods/SuperfoodCertificationResponse';
import { SuperfoodCertificationMapper } from '../../../../infra/services/superfood/SuperfoodCertificationMapper';

@Injectable()
export class ListSuperfoodCertificationsUseCase {
	constructor(
		private readonly certificationRepository: SuperfoodCertificationRepository,
	) {}

	async handle(): Promise<SuperfoodCertificationResponse[]> {
		const certifications = await this.certificationRepository.getAll();
		return certifications.map((certification) =>
			SuperfoodCertificationMapper.toResponse(certification),
		);
	}
}
