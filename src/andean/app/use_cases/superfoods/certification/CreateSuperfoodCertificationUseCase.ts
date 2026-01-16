import { Injectable } from '@nestjs/common';
import { SuperfoodCertificationRepository } from '../../../datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodCertification } from '../../../../domain/entities/superfoods/SuperfoodCertification';
import { CreateSuperfoodCertificationDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodCertificationDto';
import { SuperfoodCertificationResponse } from '../../../modules/SuperfoodCertificationResponse';
import { SuperfoodCertificationMapper } from '../../../../infra/services/superfood/SuperfoodCertificationMapper';

@Injectable()
export class CreateSuperfoodCertificationUseCase {
	constructor(
		private readonly certificationRepository: SuperfoodCertificationRepository,
	) { }

	async handle(dto: CreateSuperfoodCertificationDto): Promise<SuperfoodCertificationResponse> {
		// Crear entidad usando mapper
		const certification = SuperfoodCertificationMapper.fromCreateDto(dto);

		const savedCertification = await this.certificationRepository.save(certification);
		return SuperfoodCertificationMapper.toResponse(savedCertification);
	}
}
