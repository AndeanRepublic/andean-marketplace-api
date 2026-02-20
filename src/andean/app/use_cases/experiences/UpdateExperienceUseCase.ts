import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { Experience } from 'src/andean/domain/entities/experiences/Experience';
import { UpdateExperienceDto } from 'src/andean/infra/controllers/dto/experiences/UpdateExperienceDto';
import { UpdateExperienceBasicInfoUseCase } from './basicInfo/UpdateExperienceBasicInfoUseCase';
import { UpdateExperienceMediaInfoUseCase } from './mediaInfo/UpdateExperienceMediaInfoUseCase';
import { UpdateExperienceDetailInfoUseCase } from './detailInfo/UpdateExperienceDetailInfoUseCase';
import { UpdateExperiencePricesUseCase } from './prices/UpdateExperiencePricesUseCase';
import { UpdateExperienceAvailabilityUseCase } from './availability/UpdateExperienceAvailabilityUseCase';
import { UpdateExperienceItineraryUseCase } from './itinerary/UpdateExperienceItineraryUseCase';

@Injectable()
export class UpdateExperienceUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		private readonly updateBasicInfoUseCase: UpdateExperienceBasicInfoUseCase,
		private readonly updateMediaInfoUseCase: UpdateExperienceMediaInfoUseCase,
		private readonly updateDetailInfoUseCase: UpdateExperienceDetailInfoUseCase,
		private readonly updatePricesUseCase: UpdateExperiencePricesUseCase,
		private readonly updateAvailabilityUseCase: UpdateExperienceAvailabilityUseCase,
		private readonly updateItineraryUseCase: UpdateExperienceItineraryUseCase,
	) { }

	async handle(id: string, dto: UpdateExperienceDto): Promise<Experience> {
		const existing = await this.experienceRepository.getById(id);
		if (!existing) {
			throw new NotFoundException('Experience not found');
		}

		// Actualizar en paralelo las sub-tablas que vengan en el DTO
		const updatePromises: Promise<void>[] = [];

		if (dto.basicInfo) {
			updatePromises.push(
				this.updateBasicInfoUseCase
					.handle(existing.basicInfoId, dto.basicInfo)
					.then(() => undefined),
			);
		}

		if (dto.mediaInfo) {
			updatePromises.push(
				this.updateMediaInfoUseCase
					.handle(existing.mediaInfoId, dto.mediaInfo)
					.then(() => undefined),
			);
		}

		if (dto.detailInfo) {
			updatePromises.push(
				this.updateDetailInfoUseCase
					.handle(existing.detailInfoId, dto.detailInfo)
					.then(() => undefined),
			);
		}

		if (dto.prices) {
			updatePromises.push(
				this.updatePricesUseCase
					.handle(existing.pricesId, dto.prices)
					.then(() => undefined),
			);
		}

		if (dto.availability) {
			updatePromises.push(
				this.updateAvailabilityUseCase
					.handle(existing.availabilityId, dto.availability)
					.then(() => undefined),
			);
		}

		await Promise.all(updatePromises);

		// Itinerarios: reemplazo completo (eliminar existentes + crear nuevos)
		const experienceUpdate: Partial<Experience> = {};

		if (dto.itineraries) {
			const newItineraries = await this.updateItineraryUseCase.handle(
				existing.itineraryIds,
				dto.itineraries,
			);
			experienceUpdate.itineraryIds = newItineraries.map((it) => it.id);
		}

		// Actualizar status si viene en el DTO
		if (dto.status) {
			experienceUpdate.status = dto.status;
		}

		// Solo actualizar el registro principal si hay cambios
		if (Object.keys(experienceUpdate).length > 0) {
			return this.experienceRepository.update(id, experienceUpdate);
		}

		return (await this.experienceRepository.getById(id))!;
	}
}
