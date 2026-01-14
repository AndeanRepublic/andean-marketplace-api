import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodCertificationRepository } from '../../../datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodCertification } from '../../../../domain/entities/superfoods/SuperfoodCertification';
import { CreateSuperfoodCertificationDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodCertificationDto';
import { SuperfoodCertificationResponse } from '../../../modules/SuperfoodCertificationResponse';

@Injectable()
export class CreateSuperfoodCertificationUseCase {
	constructor(
		private readonly certificationRepository: SuperfoodCertificationRepository,
	) { }

	async handle(dto: CreateSuperfoodCertificationDto): Promise<SuperfoodCertificationResponse> {
		const certification = new SuperfoodCertification(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		const savedCertification = await this.certificationRepository.save(certification);
		return {
			id: savedCertification.id,
			name: savedCertification.name,
			icon: dto.icon,
			createdAt: savedCertification.createdAt!,
			updatedAt: savedCertification.updatedAt!,
		};
	}
}
