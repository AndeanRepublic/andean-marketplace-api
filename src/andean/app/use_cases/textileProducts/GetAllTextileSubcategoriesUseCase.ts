import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileSubcategoryRepository } from '../../datastore/textileProducts/TextileSubcategory.repo';
import { TextileSubcategory } from 'src/andean/domain/entities/textileProducts/TextileSubcategory';

@Injectable()
export class GetAllTextileSubcategoriesUseCase {
	constructor(
		@Inject(TextileSubcategoryRepository)
		private readonly textileSubcategoryRepository: TextileSubcategoryRepository,
	) {}

	async handle(): Promise<TextileSubcategory[]> {
		const subcategories =
			await this.textileSubcategoryRepository.getAllTextileSubcategories();
		if (subcategories.length === 0) {
			throw new NotFoundException('No subcategories found');
		}
		return subcategories;
	}
}
