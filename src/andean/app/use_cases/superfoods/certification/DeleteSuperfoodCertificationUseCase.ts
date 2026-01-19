import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodCertificationRepository } from '../../../datastore/superfoods/SuperfoodCertification.repo';

@Injectable()
export class DeleteSuperfoodCertificationUseCase {
	constructor(
		private readonly certificationRepository: SuperfoodCertificationRepository,
	) { }

	async handle(id: string): Promise<void> {
		const certification = await this.certificationRepository.getById(id);

		if (!certification) {
			throw new NotFoundException(`SuperfoodCertification with ID ${id} not found`);
		}

		await this.certificationRepository.delete(id);
	}
}
