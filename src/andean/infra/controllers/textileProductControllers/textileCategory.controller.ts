import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { CreateTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileCategoryUseCase';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { CreateTextileCategoryDto } from '../dto/textileProducts/CreateTextileCategory';
import { UpdateTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileCategoryUseCase';
import { GetAllTextileCategoriesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileCategoriesUseCase';
import { GetByIdTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileCategoryUseCase';
import { DeleteTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileCategoryUseCase';

@Controller('textile-products/categories')
export class TextileCategoryController {
	constructor(
		private readonly createTextileCategoryUseCase: CreateTextileCategoryUseCase,
		private readonly updateTextileCategoryUseCase: UpdateTextileCategoryUseCase,
		private readonly getAllTextileCategoriesUseCase: GetAllTextileCategoriesUseCase,
		private readonly getByIdTextileCategoryUseCase: GetByIdTextileCategoryUseCase,
		private readonly deleteTextileCategoryUseCase: DeleteTextileCategoryUseCase,
	) { }

	@Post()
	async createTextileCategory(
		@Body() body: CreateTextileCategoryDto,
	): Promise<TextileCategory> {
		return this.createTextileCategoryUseCase.handle(body);
	}

	@Put('/:id')
	async updateTextileCategory(
		@Param('id') id: string,
		@Body() body: CreateTextileCategoryDto,
	): Promise<TextileCategory> {
		return this.updateTextileCategoryUseCase.handle(id, body);
	}

	@Get()
	async getAllTextileCategories(): Promise<TextileCategory[]> {
		return this.getAllTextileCategoriesUseCase.handle();
	}

	@Get('/:id')
	async getByIdTextileCategory(
		@Param('id') id: string,
	): Promise<TextileCategory> {
		return this.getByIdTextileCategoryUseCase.handle(id);
	}

	@Delete('/:id')
	async deleteTextileCategory(@Param('id') id: string): Promise<void> {
		return this.deleteTextileCategoryUseCase.handle(id);
	}
}
