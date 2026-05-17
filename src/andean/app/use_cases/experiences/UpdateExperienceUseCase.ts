import {
	Injectable,
	Inject,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { Experience } from 'src/andean/domain/entities/experiences/Experience';
import { UpdateExperienceDto } from 'src/andean/infra/controllers/dto/experiences/UpdateExperienceDto';
import { ExperienceBasicInfoMapper } from 'src/andean/infra/services/experiences/ExperienceBasicInfoMapper';
import { ExperienceMediaInfoMapper } from 'src/andean/infra/services/experiences/ExperienceMediaInfoMapper';
import { ExperienceDetailInfoMapper } from 'src/andean/infra/services/experiences/ExperienceDetailInfoMapper';
import { UpdateExperiencePricesUseCase } from './prices/UpdateExperiencePricesUseCase';
import { UpdateExperienceAvailabilityUseCase } from './availability/UpdateExperienceAvailabilityUseCase';
import { UpdateExperienceItineraryUseCase } from './itinerary/UpdateExperienceItineraryUseCase';
import { OwnerStrategyResolver } from 'src/andean/infra/services/experiences/OwnerStrategyResolver';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';
import { ExperienceDurationUnit } from 'src/andean/domain/enums/ExperienceDurationUnit';

@Injectable()
export class UpdateExperienceUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly ownerStrategyResolver: OwnerStrategyResolver,
		private readonly updatePricesUseCase: UpdateExperiencePricesUseCase,
		private readonly updateAvailabilityUseCase: UpdateExperienceAvailabilityUseCase,
		private readonly updateItineraryUseCase: UpdateExperienceItineraryUseCase,
		private readonly sellerResourceAccess: SellerResourceAccessService,
	) {}

	async handle(
		id: string,
		dto: UpdateExperienceDto,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<Experience> {
		const existing = await this.experienceRepository.getById(id);
		if (!existing) {
			throw new NotFoundException('Experience not found');
		}

		await this.sellerResourceAccess.assertSellerCanManageOwner(
			requestingUserId,
			roles,
			existing.basicInfo.ownerType,
			existing.basicInfo.ownerId,
		);

		const experienceUpdate: Partial<Experience> = {};

		// ── Value Objects embebidos ───────────────────────────────────────────
		if (dto.basicInfo) {
			if (dto.basicInfo.ownerType && dto.basicInfo.ownerId) {
				const strategy = this.ownerStrategyResolver.resolve(
					dto.basicInfo.ownerType,
				);
				await strategy.validate(dto.basicInfo.ownerId);
			}
			const mergedBasicInfo = {
				...existing.basicInfo,
				...dto.basicInfo,
			};
			this.validateDurationFields(mergedBasicInfo);
			experienceUpdate.basicInfo = ExperienceBasicInfoMapper.fromDto(mergedBasicInfo);
		}

		if (dto.mediaInfo) {
			await this.validateMediaIds(dto);
			experienceUpdate.mediaInfo = ExperienceMediaInfoMapper.fromDto({
				...existing.mediaInfo,
				...dto.mediaInfo,
			});
		}

		if (dto.detailInfo) {
			experienceUpdate.detailInfo = ExperienceDetailInfoMapper.fromDto({
				...existing.detailInfo,
				...dto.detailInfo,
			});
		}

		// ── Sub-tablas separadas (prices, availability) ───────────────────────
		const separateUpdates: Promise<void>[] = [];

		if (dto.prices) {
			separateUpdates.push(
				this.updatePricesUseCase
					.handle(existing.pricesId, dto.prices)
					.then(() => undefined),
			);
		}

		if (dto.availability) {
			separateUpdates.push(
				this.updateAvailabilityUseCase
					.handle(existing.availabilityId, dto.availability)
					.then(() => undefined),
			);
		}

		if (separateUpdates.length > 0) {
			await Promise.all(separateUpdates);
		}

		// ── Itinerarios (reemplazo completo) ──────────────────────────────────
		if (dto.itineraries) {
			const newItineraries = await this.updateItineraryUseCase.handle(
				existing.itineraryIds,
				dto.itineraries,
			);
			experienceUpdate.itineraryIds = newItineraries.map((it) => it.id);
		}

		// ── Status ────────────────────────────────────────────────────────────
		if (dto.status) {
			experienceUpdate.status = dto.status;
		}

		// Solo actualizar el registro principal si hay cambios embebidos o de status/itinerarios
		if (Object.keys(experienceUpdate).length > 0) {
			return this.experienceRepository.update(id, experienceUpdate);
		}

		return (await this.experienceRepository.getById(id))!;
	}

	private async validateMediaIds(dto: UpdateExperienceDto): Promise<void> {
		if (!dto.mediaInfo) return;

		const allIds = [
			dto.mediaInfo.landscapeImg,
			dto.mediaInfo.thumbnailImg,
			...(dto.mediaInfo.photos || []),
			...(dto.mediaInfo.videos || []),
			...(dto.mediaInfo.ubicationImg ? [dto.mediaInfo.ubicationImg] : []),
		].filter(Boolean) as string[];

		const uniqueIds = [...new Set(allIds)];
		if (uniqueIds.length === 0) return;

		const mediaItems = await this.mediaItemRepository.getByIds(uniqueIds);
		const foundIds = new Set(mediaItems.map((m) => m.id));

		for (const mediaId of uniqueIds) {
			if (!foundIds.has(mediaId)) {
				throw new NotFoundException(`MediaItem with id ${mediaId} not found`);
			}
		}
	}

	private validateDurationFields(
		basicInfo: Experience['basicInfo'],
	): void {
		if (basicInfo.durationUnit === ExperienceDurationUnit.HOURS) {
			if (basicInfo.days !== 0 || basicInfo.nights !== 0) {
				throw new BadRequestException(
					'When durationUnit is HOURS, days and nights must be 0',
				);
			}
			if (!basicInfo.hours || basicInfo.hours < 1) {
				throw new BadRequestException(
					'When durationUnit is HOURS, hours must be greater than 0',
				);
			}
			return;
		}

		if (basicInfo.days < 1) {
			throw new BadRequestException(
				'When durationUnit is DAYS, days must be at least 1',
			);
		}
		if (basicInfo.nights < 0) {
			throw new BadRequestException(
				'When durationUnit is DAYS, nights must be 0 or greater',
			);
		}
		if (basicInfo.nights > basicInfo.days - 1) {
			throw new BadRequestException(
				'When durationUnit is DAYS, nights cannot be greater than days - 1',
			);
		}
	}
}
