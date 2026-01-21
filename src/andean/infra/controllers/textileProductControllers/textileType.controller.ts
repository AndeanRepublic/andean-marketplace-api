import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { CreateTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileTypeUseCase';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';
import { CreateTextileTypeDto } from '../dto/textileProducts/CreateTextileTypeDto';
import { UpdateTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileTypeUseCase';
import { GetAllTextileTypesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileTypesUseCase';
import { GetByIdTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileTypeUseCase';
import { DeleteTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileTypeUseCase';

@Controller('textile-products/types')
export class TextileTypeController {
	constructor(
		private readonly createTextileTypeUseCase: CreateTextileTypeUseCase,
		private readonly updateTextileTypeUseCase: UpdateTextileTypeUseCase,
		private readonly getAllTextileTypesUseCase: GetAllTextileTypesUseCase,
		private readonly getByIdTextileTypeUseCase: GetByIdTextileTypeUseCase,
		private readonly deleteTextileTypeUseCase: DeleteTextileTypeUseCase,
	) { }

	@Post()
	async createTextileType(
		@Body() body: CreateTextileTypeDto,
	): Promise<TextileType> {
		return this.createTextileTypeUseCase.handle(body);
	}

	@Put('/:id')
	async updateTextileType(
		@Param('id') id: string,
		@Body() body: CreateTextileTypeDto,
	): Promise<TextileType> {
		return this.updateTextileTypeUseCase.handle(id, body);
	}

	@Get()
	async getAllTextileTypes(): Promise<TextileType[]> {
		return this.getAllTextileTypesUseCase.handle();
	}

	@Get('/:id')
	async getByIdTextileType(@Param('id') id: string): Promise<TextileType> {
		return this.getByIdTextileTypeUseCase.handle(id);
	}

	@Delete('/:id')
	async deleteTextileType(@Param('id') id: string): Promise<void> {
		return this.deleteTextileTypeUseCase.handle(id);
	}
}
