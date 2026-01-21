import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { CreateTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileCraftTechniqueUseCase';
import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';
import { CreateTextileCraftTechniqueDto } from '../dto/textileProducts/CreateTextileCraftTechniqueDto';
import { UpdateTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileCraftTechniqueUseCase';
import { GetAllTextileCraftTechniquesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileCraftTechniquesUseCase';
import { GetByIdTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileCraftTechniqueUseCase';
import { DeleteTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileCraftTechniqueUseCase';

@Controller('textile-products/craft-techniques')
export class TextileCraftTechniqueController {
	constructor(
		private readonly createTextileCraftTechniqueUseCase: CreateTextileCraftTechniqueUseCase,
		private readonly updateTextileCraftTechniqueUseCase: UpdateTextileCraftTechniqueUseCase,
		private readonly getAllTextileCraftTechniquesUseCase: GetAllTextileCraftTechniquesUseCase,
		private readonly getByIdTextileCraftTechniqueUseCase: GetByIdTextileCraftTechniqueUseCase,
		private readonly deleteTextileCraftTechniqueUseCase: DeleteTextileCraftTechniqueUseCase,
	) { }

	@Post()
	async createTextileCraftTechnique(
		@Body() body: CreateTextileCraftTechniqueDto,
	): Promise<TextileCraftTechnique> {
		return this.createTextileCraftTechniqueUseCase.handle(body);
	}

	@Put('/:id')
	async updateTextileCraftTechnique(
		@Param('id') id: string,
		@Body() body: CreateTextileCraftTechniqueDto,
	): Promise<TextileCraftTechnique> {
		return this.updateTextileCraftTechniqueUseCase.handle(id, body);
	}

	@Get()
	async getAllTextileCraftTechniques(): Promise<TextileCraftTechnique[]> {
		return this.getAllTextileCraftTechniquesUseCase.handle();
	}

	@Get('/:id')
	async getByIdTextileCraftTechnique(
		@Param('id') id: string,
	): Promise<TextileCraftTechnique> {
		return this.getByIdTextileCraftTechniqueUseCase.handle(id);
	}

	@Delete('/:id')
	async deleteTextileCraftTechnique(@Param('id') id: string): Promise<void> {
		return this.deleteTextileCraftTechniqueUseCase.handle(id);
	}
}
