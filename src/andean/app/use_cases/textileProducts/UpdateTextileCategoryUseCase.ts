import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { TextileCategoryMapper } from 'src/andean/infra/services/textileProducts/TextileCategoryMapper';
import { CreateTextileCategoryDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileCategory';

@Injectable()
export class UpdateTextileCategoryUseCase {
	constructor(
		@Inject(TextileCategoryRepository)
		private readonly textileCategoryRepository: TextileCategoryRepository,
	) {}

	async handle(
		id: string,
		dto: CreateTextileCategoryDto,
	): Promise<TextileCategory> {
		const categoryFound =
			await this.textileCategoryRepository.getCategoryById(id);
		if (!categoryFound) {
			throw new NotFoundException('Category not found');
		}
		const toUpdate = TextileCategoryMapper.fromUpdateDto(categoryFound.id, dto);
		return this.textileCategoryRepository.updateCategory(id, toUpdate);
	}
}
