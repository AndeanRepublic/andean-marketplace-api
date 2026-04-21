import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodCertificationRepository } from '../../../datastore/superfoods/SuperfoodCertification.repo';
import { CreateSuperfoodCertificationDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodCertificationDto';
import { SuperfoodCertificationResponse } from '../../../models/superfoods/SuperfoodCertificationResponse';
import { SuperfoodCertification } from '../../../../domain/entities/superfoods/SuperfoodCertification';
import { SuperfoodCertificationMapper } from '../../../../infra/services/superfood/SuperfoodCertificationMapper';

@Injectable()
export class UpdateSuperfoodCertificationUseCase {
	constructor(
		private readonly certificationRepository: SuperfoodCertificationRepository,
	) {}

	async handle(
		id: string,
		dto: CreateSuperfoodCertificationDto,
	): Promise<SuperfoodCertificationResponse> {
		const existing = await this.certificationRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(
				`SuperfoodCertification with ID ${id} not found`,
			);
		}

		const updated = new SuperfoodCertification(
			existing.id,
			dto.name,
			dto.certifyingEntity,
			existing.createdAt,
			new Date(),
		);
		const saved = await this.certificationRepository.update(updated);
		return SuperfoodCertificationMapper.toResponse(saved);
	}
}
