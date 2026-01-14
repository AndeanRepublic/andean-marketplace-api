import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodCertificationRepository } from '../../../datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodCertification } from '../../../../domain/entities/superfoods/SuperfoodCertification';

@Injectable()
export class GetSuperfoodCertificationByIdUseCase {
	constructor(
		private readonly certificationRepository: SuperfoodCertificationRepository,
	) { }

	async handle(id: string): Promise<SuperfoodCertification> {
		const certification = await this.certificationRepository.getById(id);

		if (!certification) {
			throw new NotFoundException(`SuperfoodCertification with ID ${id} not found`);
		}

		return certification;
	}
}
