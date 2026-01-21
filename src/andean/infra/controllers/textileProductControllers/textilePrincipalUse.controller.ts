import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { CreateTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextilePrincipalUseUseCase';
import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';
import { CreateTextilePrincipalUseDto } from '../dto/textileProducts/CreateTextilePrincipalUseDto';
import { UpdateTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextilePrincipalUseUseCase';
import { GetAllTextilePrincipalUsesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextilePrincipalUsesUseCase';
import { GetByIdTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextilePrincipalUseUseCase';
import { DeleteTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextilePrincipalUseUseCase';

@Controller('textile-products/principal-uses')
export class TextilePrincipalUseController {
	constructor(
		private readonly createTextilePrincipalUseUseCase: CreateTextilePrincipalUseUseCase,
		private readonly updateTextilePrincipalUseUseCase: UpdateTextilePrincipalUseUseCase,
		private readonly getAllTextilePrincipalUsesUseCase: GetAllTextilePrincipalUsesUseCase,
		private readonly getByIdTextilePrincipalUseUseCase: GetByIdTextilePrincipalUseUseCase,
		private readonly deleteTextilePrincipalUseUseCase: DeleteTextilePrincipalUseUseCase,
	) { }

	@Post()
	async createTextilePrincipalUse(
		@Body() body: CreateTextilePrincipalUseDto,
	): Promise<TextilePrincipalUse> {
		return this.createTextilePrincipalUseUseCase.handle(body);
	}

	@Put('/:id')
	async updateTextilePrincipalUse(
		@Param('id') id: string,
		@Body() body: CreateTextilePrincipalUseDto,
	): Promise<TextilePrincipalUse> {
		return this.updateTextilePrincipalUseUseCase.handle(id, body);
	}

	@Get()
	async getAllTextilePrincipalUses(): Promise<TextilePrincipalUse[]> {
		return this.getAllTextilePrincipalUsesUseCase.handle();
	}

	@Get('/:id')
	async getByIdTextilePrincipalUse(
		@Param('id') id: string,
	): Promise<TextilePrincipalUse> {
		return this.getByIdTextilePrincipalUseUseCase.handle(id);
	}

	@Delete('/:id')
	async deleteTextilePrincipalUse(@Param('id') id: string): Promise<void> {
		return this.deleteTextilePrincipalUseUseCase.handle(id);
	}
}
