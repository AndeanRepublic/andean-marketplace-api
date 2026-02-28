import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCertificationRepository } from '../../datastore/textileProducts/TextileCertification.repo';

@Injectable()
export class DeleteTextileCertificationUseCase {
	constructor(
		@Inject(TextileCertificationRepository)
		private readonly textileCertificationRepository: TextileCertificationRepository,
	) {}

	async handle(id: string): Promise<void> {
		const certificationFound =
			await this.textileCertificationRepository.getTextileCertificationById(id);
		if (!certificationFound) {
			throw new NotFoundException('Certification not found');
		}
		await this.textileCertificationRepository.deleteTextileCertification(id);
		return;
	}
}
