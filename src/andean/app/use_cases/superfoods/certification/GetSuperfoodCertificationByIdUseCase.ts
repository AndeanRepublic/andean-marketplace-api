import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodCertificationRepository } from '../../../datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodCertification } from '../../../../domain/entities/superfoods/SuperfoodCertification';
import { SuperfoodCertificationResponse } from '../../../modules/superfoods/SuperfoodCertificationResponse';
import { SuperfoodCertificationMapper } from '../../../../infra/services/superfood/SuperfoodCertificationMapper';

@Injectable()
export class GetSuperfoodCertificationByIdUseCase {
	constructor(
		private readonly certificationRepository: SuperfoodCertificationRepository,
	) {}

	async handle(id: string): Promise<SuperfoodCertificationResponse> {
		const certification = await this.certificationRepository.getById(id);

		if (!certification) {
			throw new NotFoundException(
				`SuperfoodCertification with ID ${id} not found`,
			);
		}

		return SuperfoodCertificationMapper.toResponse(certification);
	}
}
