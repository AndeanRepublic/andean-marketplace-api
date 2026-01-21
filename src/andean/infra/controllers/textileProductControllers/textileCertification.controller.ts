import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
} from '@nestjs/swagger';
import { CreateTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileCertificationUseCase';
import { TextileCertification } from 'src/andean/domain/entities/textileProducts/TextileCertification';
import { CreateTextileCertificationDto } from '../dto/textileProducts/CreateTextileCertificationDto';
import { UpdateTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileCertificationUseCase';
import { GetAllTextileCertificationsUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileCertificationsUseCase';
import { GetByIdTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileCertificationUseCase';
import { DeleteTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileCertificationUseCase';

@ApiTags('Textile Certifications')
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
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva certificación textil',
		description: 'Crea una nueva certificación para productos textiles (ej: Comercio Justo, Artesanía Certificada, Orgánico)',
	})
	@ApiResponse({
		status: 201,
		description: 'Certificación creada exitosamente',
		type: TextileCertification,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createTextileCertification(
		@Body() body: CreateTextileCertificationDto,
	): Promise<TextileCertification> {
		return this.createTextileCertificationUseCase.handle(body);
	}

	@Put('/:id')
	@ApiOperation({
		summary: 'Actualizar certificación textil',
		description: 'Actualiza los datos de una certificación textil existente',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la certificación',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 200,
		description: 'Certificación actualizada exitosamente',
		type: TextileCertification,
	})
	@ApiResponse({
		status: 404,
		description: 'Certificación no encontrada',
	})
	async updateTextileCertification(
		@Param('id') id: string,
		@Body() body: CreateTextileCertificationDto,
	): Promise<TextileCertification> {
		return this.updateTextileCertificationUseCase.handle(id, body);
	}

	@Get()
	@ApiOperation({
		summary: 'Listar todas las certificaciones textiles',
		description: 'Retorna todas las certificaciones disponibles para productos textiles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de certificaciones',
		type: [TextileCertification],
	})
	async getAllTextileCertifications(): Promise<TextileCertification[]> {
		return this.getAllTextileCertificationsUseCase.handle();
	}

	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener certificación por ID',
		description: 'Retorna una certificación textil específica por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la certificación',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 200,
		description: 'Certificación encontrada',
		type: TextileCertification,
	})
	@ApiResponse({
		status: 404,
		description: 'Certificación no encontrada',
	})
	async getByIdTextileCertification(
		@Param('id') id: string,
	): Promise<TextileCertification> {
		return this.getByIdTextileCertificationUseCase.handle(id);
	}

	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar certificación textil',
		description: 'Elimina una certificación textil por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la certificación a eliminar',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 204,
		description: 'Certificación eliminada exitosamente',
	})
	@ApiResponse({
		status: 404,
		description: 'Certificación no encontrada',
	})
	async deleteTextileCertification(@Param('id') id: string): Promise<void> {
		return this.deleteTextileCertificationUseCase.handle(id);
	}
}
