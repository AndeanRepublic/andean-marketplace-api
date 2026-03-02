import { Inject, Injectable } from '@nestjs/common';
import { TextileSubcategoryRepository } from '../../datastore/textileProducts/TextileSubcategory.repo';
import { CreateTextileSubcategoryDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileSubcategoryDto';
import { TextileSubcategory } from 'src/andean/domain/entities/textileProducts/TextileSubcategory';
import { TextileSubcategoryMapper } from 'src/andean/infra/services/textileProducts/TextileSubcategoryMapper';

@Injectable()
export class CreateTextileSubcategoryUseCase {
	constructor(
		@Inject(TextileSubcategoryRepository)
		private readonly textileSubcategoryRepository: TextileSubcategoryRepository,
	) {}

	async handle(dto: CreateTextileSubcategoryDto): Promise<TextileSubcategory> {
		const textileSubcategoryToSave =
			TextileSubcategoryMapper.fromCreateDto(dto);
		return this.textileSubcategoryRepository.saveTextileSubcategory(
			textileSubcategoryToSave,
		);
	}
}
