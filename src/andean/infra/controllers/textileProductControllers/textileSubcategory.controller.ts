import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { CreateTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileSubcategoryUseCase';
import { TextileSubcategory } from 'src/andean/domain/entities/textileProducts/TextileSubcategory';
import { CreateTextileSubcategoryDto } from '../dto/textileProducts/CreateTextileSubcategoryDto';
import { UpdateTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileSubcategoryUseCase';
import { GetAllTextileSubcategoriesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileSubcategoriesUseCase';
import { GetByIdTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileSubcategoryUseCase';
import { DeleteTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileSubcategoryUseCase';

@Controller('textile-products/subcategories')
export class TextileSubcategoryController {
	constructor(
		private readonly createTextileSubcategoryUseCase: CreateTextileSubcategoryUseCase,
		private readonly updateTextileSubcategoryUseCase: UpdateTextileSubcategoryUseCase,
		private readonly getAllTextileSubcategoriesUseCase: GetAllTextileSubcategoriesUseCase,
		private readonly getByIdTextileSubcategoryUseCase: GetByIdTextileSubcategoryUseCase,
		private readonly deleteTextileSubcategoryUseCase: DeleteTextileSubcategoryUseCase,
	) { }

	@Post()
	async createTextileSubcategory(
		@Body() body: CreateTextileSubcategoryDto,
	): Promise<TextileSubcategory> {
		return this.createTextileSubcategoryUseCase.handle(body);
	}

	@Put('/:id')
	async updateTextileSubcategory(
		@Param('id') id: string,
		@Body() body: CreateTextileSubcategoryDto,
	): Promise<TextileSubcategory> {
		return this.updateTextileSubcategoryUseCase.handle(id, body);
	}

	@Get()
	async getAllTextileSubcategories(): Promise<TextileSubcategory[]> {
		return this.getAllTextileSubcategoriesUseCase.handle();
	}

	@Get('/:id')
	async getByIdTextileSubcategory(
		@Param('id') id: string,
	): Promise<TextileSubcategory> {
		return this.getByIdTextileSubcategoryUseCase.handle(id);
	}

	@Delete('/:id')
	async deleteTextileSubcategory(@Param('id') id: string): Promise<void> {
		return this.deleteTextileSubcategoryUseCase.handle(id);
	}
}
