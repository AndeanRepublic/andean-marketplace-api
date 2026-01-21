import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { CreateTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileStyleUseCase';
import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { CreateTextileStyleDto } from '../dto/textileProducts/CreateTextileStyleDto';
import { UpdateTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileStyleUseCase';
import { GetAllTextileStylesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileStylesUseCase';
import { GetByIdTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileStyleUseCase';
import { DeleteTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileStyleUseCase';

@Controller('textile-products/styles')
export class TextileStyleController {
	constructor(
		private readonly createTextileStyleUseCase: CreateTextileStyleUseCase,
		private readonly updateTextileStyleUseCase: UpdateTextileStyleUseCase,
		private readonly getAllTextileStylesUseCase: GetAllTextileStylesUseCase,
		private readonly getByIdTextileStyleUseCase: GetByIdTextileStyleUseCase,
		private readonly deleteTextileStyleUseCase: DeleteTextileStyleUseCase,
	) { }

	@Post()
	async createTextileStyle(
		@Body() body: CreateTextileStyleDto,
	): Promise<TextileStyle> {
		return this.createTextileStyleUseCase.handle(body);
	}

	@Put('/:id')
	async updateTextileStyle(
		@Param('id') id: string,
		@Body() body: CreateTextileStyleDto,
	): Promise<TextileStyle> {
		return this.updateTextileStyleUseCase.handle(id, body);
	}

	@Get()
	async getAllTextileStyles(): Promise<TextileStyle[]> {
		return this.getAllTextileStylesUseCase.handle();
	}

	@Get('/:id')
	async getByIdTextileStyle(@Param('id') id: string): Promise<TextileStyle> {
		return this.getByIdTextileStyleUseCase.handle(id);
	}

	@Delete('/:id')
	async deleteTextileStyle(@Param('id') id: string): Promise<void> {
		return this.deleteTextileStyleUseCase.handle(id);
	}
}
