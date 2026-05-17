import { Injectable, Inject } from '@nestjs/common';
import {
	ExperienceRepository,
	ExperienceFilters,
} from '../../datastore/experiences/Experience.repo';
import {
	PaginatedExperiencesResponse,
	ExperienceListItem,
} from '../../models/experiences/ExperienceListItemResponse';
import { MediaUrlResolver } from 'src/andean/infra/services/media/MediaUrlResolver';

@Injectable()
export class GetAllExperiencesUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(
		filters?: ExperienceFilters,
	): Promise<PaginatedExperiencesResponse> {
		const page = filters?.page || 1;
		const perPage = filters?.perPage || 20;

		const { items, total } = await this.experienceRepository.getAllWithFilters(
			filters || { page, perPage },
		);

		const experiences: ExperienceListItem[] = items.map((raw) => ({
			id: raw.id,
			title: raw.title,
			ownerName: raw.ownerName,
			price: raw.adultsPrice,
			place: raw.ubication,
			days: raw.days,
			status: raw.status,
			mainImage: {
				name: raw.mainImageName,
				url: this.mediaUrlResolver.resolveKey(raw.mainImageUrl),
			},
		}));

		return {
			experiences,
			pagination: {
				total,
				page,
				per_page: perPage,
			},
		};
	}
}
