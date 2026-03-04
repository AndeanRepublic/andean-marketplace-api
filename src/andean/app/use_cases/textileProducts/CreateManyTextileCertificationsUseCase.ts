import { Inject, Injectable } from '@nestjs/common';
import { TextileCertificationRepository } from '../../datastore/textileProducts/TextileCertification.repo';
import { CreateManyTextileCertificationsDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateManyTextileCertificationsDto';
import { TextileCertification } from 'src/andean/domain/entities/textileProducts/TextileCertification';
import { TextileCertificationMapper } from 'src/andean/infra/services/textileProducts/TextileCertificationMapper';

@Injectable()
export class CreateManyTextileCertificationsUseCase {
	constructor(
		@Inject(TextileCertificationRepository)
		private readonly textileCertificationRepository: TextileCertificationRepository,
	) {}

	async handle(
		dto: CreateManyTextileCertificationsDto,
	): Promise<TextileCertification[]> {
		const textileCertificationsToSave = dto.textileCertifications.map(
			(itemDto) => TextileCertificationMapper.fromCreateDto(itemDto),
		);
		return this.textileCertificationRepository.createManyTextileCertifications(
			textileCertificationsToSave,
		);
	}
}
