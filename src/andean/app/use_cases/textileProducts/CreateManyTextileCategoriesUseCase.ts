import { Inject, Injectable } from '@nestjs/common';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { CreateManyTextileCategoriesDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateManyTextileCategoriesDto';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { TextileCategoryMapper } from 'src/andean/infra/services/textileProducts/TextileCategoryMapper';

@Injectable()
export class CreateManyTextileCategoriesUseCase {
	constructor(
		@Inject(TextileCategoryRepository)
		private readonly textileCategoryRepository: TextileCategoryRepository,
	) {}

	async handle(dto: CreateManyTextileCategoriesDto): Promise<TextileCategory[]> {
		const textileCategoriesToSave = dto.textileCategories.map((itemDto) =>
			TextileCategoryMapper.fromCreateDto(itemDto),
		);
		return this.textileCategoryRepository.createManyCategories(
			textileCategoriesToSave,
		);
	}
}
