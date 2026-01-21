import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { CreateColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/CreateColorOptionAlternativeUseCase';
import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';
import { CreateColorOptionAlternativeDto } from './dto/textileProducts/CreateColorOptionAlternativeDto';
import { GetAllColorOptionAlternativesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllColorOptionAlternativesUseCase';
import { GetByIdColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdColorOptionAlternativeUseCase';
import { UpdateColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateColorOptionAlternativeUseCase';
import { DeleteColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteColorOptionAlternativeUseCase';
import { CreateManyColorOptionAlternativesUseCase } from 'src/andean/app/use_cases/textileProducts/CreateManyColorOptionAlternativesUseCase';
import { CreateManyColorOptionAlternativesDto } from './dto/textileProducts/CreateManyColorOptionAlternativesDto';

@Controller('textile-products/color-option-alternatives')
export class ColorOptionAlternativeController {
	constructor(
		private readonly createColorOptionAlternativeUseCase: CreateColorOptionAlternativeUseCase,
		private readonly updateColorOptionAlternativeUseCase: UpdateColorOptionAlternativeUseCase,
		private readonly getAllColorOptionAlternativesUseCase: GetAllColorOptionAlternativesUseCase,
		private readonly getByIdColorOptionAlternativeUseCase: GetByIdColorOptionAlternativeUseCase,
		private readonly deleteColorOptionAlternativeUseCase: DeleteColorOptionAlternativeUseCase,
		private readonly createManyColorOptionAlternativesUseCase: CreateManyColorOptionAlternativesUseCase,
	) { }

	@Post()
	async createColorOptionAlternative(
		@Body() body: CreateColorOptionAlternativeDto,
	): Promise<ColorOptionAlternative> {
		return this.createColorOptionAlternativeUseCase.handle(body);
	}

	@Post('/bulk')
	async createManyColorOptionAlternatives(
		@Body() body: CreateManyColorOptionAlternativesDto,
	): Promise<ColorOptionAlternative[]> {
		return this.createManyColorOptionAlternativesUseCase.handle(body);
	}

	@Put('/:id')
	async updateColorOptionAlternative(
		@Param('id') id: string,
		@Body() body: CreateColorOptionAlternativeDto,
	): Promise<ColorOptionAlternative> {
		return this.updateColorOptionAlternativeUseCase.handle(id, body);
	}

	@Get()
	async getAllColorOptionAlternatives(): Promise<ColorOptionAlternative[]> {
		return this.getAllColorOptionAlternativesUseCase.handle();
	}

	@Get('/:id')
	async getByIdColorOptionAlternative(
		@Param('id') id: string,
	): Promise<ColorOptionAlternative> {
		return this.getByIdColorOptionAlternativeUseCase.handle(id);
	}

	@Delete('/:id')
	async deleteColorOptionAlternative(@Param('id') id: string): Promise<void> {
		return this.deleteColorOptionAlternativeUseCase.handle(id);
	}
}
