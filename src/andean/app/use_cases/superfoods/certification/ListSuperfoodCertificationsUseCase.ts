import { Injectable } from '@nestjs/common';
import { SuperfoodCertificationRepository } from '../../../datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodCertification } from '../../../../domain/entities/superfoods/SuperfoodCertification';

@Injectable()
export class ListSuperfoodCertificationsUseCase {
	constructor(
		private readonly certificationRepository: SuperfoodCertificationRepository,
	) { }

	async handle(): Promise<SuperfoodCertification[]> {
		return await this.certificationRepository.getAll();
	}
}
