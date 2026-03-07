import {
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { CreateManySealsDto } from 'src/andean/infra/controllers/dto/community/CreateManySealsDto';
import { Seal } from 'src/andean/domain/entities/community/Seal';
import { SealMapper } from 'src/andean/infra/services/community/SealMapper';

@Injectable()
export class CreateManySealsUseCase {
	constructor(
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
	) {}

	async handle(dto: CreateManySealsDto): Promise<Seal[]> {
		const uniqueLogoMediaIds = [
			...new Set(dto.seals.map((s) => s.logoMediaId)),
		];
		for (const logoMediaId of uniqueLogoMediaIds) {
			const mediaItemFound =
				await this.mediaItemRepository.getById(logoMediaId);
			if (!mediaItemFound) {
				throw new NotFoundException(
					`MediaItem with id ${logoMediaId} not found`,
				);
			}
		}

		const sealsToSave = dto.seals.map((itemDto) =>
			SealMapper.fromCreateDto(itemDto),
		);
		return this.sealRepository.createMany(sealsToSave);
	}
}
