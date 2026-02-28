import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileSubcategoryRepository } from '../../datastore/textileProducts/TextileSubcategory.repo';

@Injectable()
export class DeleteTextileSubcategoryUseCase {
	constructor(
		@Inject(TextileSubcategoryRepository)
		private readonly textileSubcategoryRepository: TextileSubcategoryRepository,
	) {}

	async handle(id: string): Promise<void> {
		const subcategoryFound =
			await this.textileSubcategoryRepository.getTextileSubcategoryById(id);
		if (!subcategoryFound) {
			throw new NotFoundException('Subcategory not found');
		}
		await this.textileSubcategoryRepository.deleteTextileSubcategory(id);
		return;
	}
}
