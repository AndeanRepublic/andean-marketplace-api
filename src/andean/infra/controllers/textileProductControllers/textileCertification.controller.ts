import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { CreateTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileCertificationUseCase';
import { TextileCertification } from 'src/andean/domain/entities/textileProducts/TextileCertification';
import { CreateTextileCertificationDto } from '../dto/textileProducts/CreateTextileCertificationDto';
import { UpdateTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileCertificationUseCase';
import { GetAllTextileCertificationsUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileCertificationsUseCase';
import { GetByIdTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileCertificationUseCase';
import { DeleteTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileCertificationUseCase';

@Controller('textile-products/certifications')
export class TextileCertificationController {
	constructor(
		private readonly createTextileCertificationUseCase: CreateTextileCertificationUseCase,
		private readonly updateTextileCertificationUseCase: UpdateTextileCertificationUseCase,
		private readonly getAllTextileCertificationsUseCase: GetAllTextileCertificationsUseCase,
		private readonly getByIdTextileCertificationUseCase: GetByIdTextileCertificationUseCase,
		private readonly deleteTextileCertificationUseCase: DeleteTextileCertificationUseCase,
	) { }

	@Post()
	async createTextileCertification(
		@Body() body: CreateTextileCertificationDto,
	): Promise<TextileCertification> {
		return this.createTextileCertificationUseCase.handle(body);
	}

	@Put('/:id')
	async updateTextileCertification(
		@Param('id') id: string,
		@Body() body: CreateTextileCertificationDto,
	): Promise<TextileCertification> {
		return this.updateTextileCertificationUseCase.handle(id, body);
	}

	@Get()
	async getAllTextileCertifications(): Promise<TextileCertification[]> {
		return this.getAllTextileCertificationsUseCase.handle();
	}

	@Get('/:id')
	async getByIdTextileCertification(
		@Param('id') id: string,
	): Promise<TextileCertification> {
		return this.getByIdTextileCertificationUseCase.handle(id);
	}

	@Delete('/:id')
	async deleteTextileCertification(@Param('id') id: string): Promise<void> {
		return this.deleteTextileCertificationUseCase.handle(id);
	}
}
