import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodCertificationRepository } from '../../../datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodCertification } from '../../../../domain/entities/superfoods/SuperfoodCertification';
import { CreateSuperfoodCertificationDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodCertificationDto';

@Injectable()
export class CreateSuperfoodCertificationUseCase {
	constructor(
		private readonly certificationRepository: SuperfoodCertificationRepository,
	) { }

	async handle(dto: CreateSuperfoodCertificationDto): Promise<SuperfoodCertification> {
		const certification = new SuperfoodCertification(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		return await this.certificationRepository.save(certification);
	}
}
