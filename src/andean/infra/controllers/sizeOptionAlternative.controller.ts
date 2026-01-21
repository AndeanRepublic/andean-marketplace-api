import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { CreateSizeOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/CreateSizeOptionAlternativeUseCase';
import { SizeOptionAlternative } from 'src/andean/domain/entities/textileProducts/SizeOptionAlternative';
import { CreateSizeOptionAlternativeDto } from './dto/textileProducts/CreateSizeOptionAlternativeDto';
import { GetAllSizeOptionAlternativesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllSizeOptionAlternativesUseCase';
import { GetByIdSizeOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdSizeOptionAlternativeUseCase';
import { UpdateSizeOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateSizeOptionAlternativeUseCase';
import { DeleteSizeOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteSizeOptionAlternativeUseCase';
import { CreateManySizeOptionAlternativesUseCase } from 'src/andean/app/use_cases/textileProducts/CreateManySizeOptionAlternativesUseCase';
import { CreateManySizeOptionAlternativesDto } from './dto/textileProducts/CreateManySizeOptionAlternativesDto';

@Controller('textile-products/size-option-alternatives')
export class SizeOptionAlternativeController {
	constructor(
		private readonly createSizeOptionAlternativeUseCase: CreateSizeOptionAlternativeUseCase,
		private readonly createManySizeOptionAlternativesUseCase: CreateManySizeOptionAlternativesUseCase,
		private readonly updateSizeOptionAlternativeUseCase: UpdateSizeOptionAlternativeUseCase,
		private readonly getAllSizeOptionAlternativesUseCase: GetAllSizeOptionAlternativesUseCase,
		private readonly getByIdSizeOptionAlternativeUseCase: GetByIdSizeOptionAlternativeUseCase,
		private readonly deleteSizeOptionAlternativeUseCase: DeleteSizeOptionAlternativeUseCase,
	) { }

	@Post()
	async createSizeOptionAlternative(
		@Body() body: CreateSizeOptionAlternativeDto,
	): Promise<SizeOptionAlternative> {
		return this.createSizeOptionAlternativeUseCase.handle(body);
	}

	@Post('/bulk')
	async createManySizeOptionAlternatives(
		@Body() body: CreateManySizeOptionAlternativesDto,
	): Promise<SizeOptionAlternative[]> {
		return this.createManySizeOptionAlternativesUseCase.handle(body);
	}

	@Put('/:id')
	async updateSizeOptionAlternative(
		@Param('id') id: string,
		@Body() body: CreateSizeOptionAlternativeDto,
	): Promise<SizeOptionAlternative> {
		return this.updateSizeOptionAlternativeUseCase.handle(id, body);
	}

	@Get()
	async getAllSizeOptionAlternatives(): Promise<SizeOptionAlternative[]> {
		return this.getAllSizeOptionAlternativesUseCase.handle();
	}

	@Get('/:id')
	async getByIdSizeOptionAlternative(
		@Param('id') id: string,
	): Promise<SizeOptionAlternative> {
		return this.getByIdSizeOptionAlternativeUseCase.handle(id);
	}

	@Delete('/:id')
	async deleteSizeOptionAlternative(@Param('id') id: string): Promise<void> {
		return this.deleteSizeOptionAlternativeUseCase.handle(id);
	}
}
