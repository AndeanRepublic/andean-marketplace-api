import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileSubcategoryRepository } from '../../datastore/textileProducts/TextileSubcategory.repo';
import { TextileSubcategory } from 'src/andean/domain/entities/textileProducts/TextileSubcategory';
import { TextileSubcategoryMapper } from 'src/andean/infra/services/textileProducts/TextileSubcategoryMapper';
import { CreateTextileSubcategoryDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileSubcategoryDto';

@Injectable()
export class UpdateTextileSubcategoryUseCase {
	constructor(
		@Inject(TextileSubcategoryRepository)
		private readonly textileSubcategoryRepository: TextileSubcategoryRepository,
	) {}

	async handle(
		id: string,
		dto: CreateTextileSubcategoryDto,
	): Promise<TextileSubcategory> {
		const subcategoryFound =
			await this.textileSubcategoryRepository.getTextileSubcategoryById(id);
		if (!subcategoryFound) {
			throw new NotFoundException('Subcategory not found');
		}
		const toUpdate = TextileSubcategoryMapper.fromUpdateDto(id, dto);
		return this.textileSubcategoryRepository.updateTextileSubcategory(
			id,
			toUpdate,
		);
	}
}
