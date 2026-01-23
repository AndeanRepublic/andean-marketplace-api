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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateSizeOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/CreateSizeOptionAlternativeUseCase';
import { SizeOptionAlternative } from 'src/andean/domain/entities/textileProducts/SizeOptionAlternative';
import { CreateSizeOptionAlternativeDto } from './dto/textileProducts/CreateSizeOptionAlternativeDto';
import { GetAllSizeOptionAlternativesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllSizeOptionAlternativesUseCase';
import { GetByIdSizeOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdSizeOptionAlternativeUseCase';
import { UpdateSizeOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateSizeOptionAlternativeUseCase';
import { DeleteSizeOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteSizeOptionAlternativeUseCase';
import { CreateManySizeOptionAlternativesUseCase } from 'src/andean/app/use_cases/textileProducts/CreateManySizeOptionAlternativesUseCase';
import { CreateManySizeOptionAlternativesDto } from './dto/textileProducts/CreateManySizeOptionAlternativesDto';

@ApiTags('Textile Size Options')
@Controller('textile-products/size-option-alternatives')
export class SizeOptionAlternativeController {
	constructor(
		private readonly createSizeOptionAlternativeUseCase: CreateSizeOptionAlternativeUseCase,
		private readonly createManySizeOptionAlternativesUseCase: CreateManySizeOptionAlternativesUseCase,
		private readonly updateSizeOptionAlternativeUseCase: UpdateSizeOptionAlternativeUseCase,
		private readonly getAllSizeOptionAlternativesUseCase: GetAllSizeOptionAlternativesUseCase,
		private readonly getByIdSizeOptionAlternativeUseCase: GetByIdSizeOptionAlternativeUseCase,
		private readonly deleteSizeOptionAlternativeUseCase: DeleteSizeOptionAlternativeUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva opción de talla',
		description:
			'Crea una nueva opción de talla para variantes de productos textiles (ej: XS, S, M, L, XL, XXL, Único)',
	})
	@ApiResponse({
		status: 201,
		description: 'Opción de talla creada exitosamente',
		type: SizeOptionAlternative,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createSizeOptionAlternative(
		@Body() body: CreateSizeOptionAlternativeDto,
	): Promise<SizeOptionAlternative> {
		return this.createSizeOptionAlternativeUseCase.handle(body);
	}

	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples opciones de talla',
		description:
			'Crea múltiples opciones de talla en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiResponse({
		status: 201,
		description: 'Opciones de talla creadas exitosamente',
		type: [SizeOptionAlternative],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManySizeOptionAlternatives(
		@Body() body: CreateManySizeOptionAlternativesDto,
	): Promise<SizeOptionAlternative[]> {
		return this.createManySizeOptionAlternativesUseCase.handle(body);
	}

	@Put('/:id')
	@ApiOperation({
		summary: 'Actualizar opción de talla',
		description: 'Actualiza los datos de una opción de talla existente',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la opción de talla',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 200,
		description: 'Opción de talla actualizada exitosamente',
		type: SizeOptionAlternative,
	})
	@ApiResponse({
		status: 404,
		description: 'Opción de talla no encontrada',
	})
	async updateSizeOptionAlternative(
		@Param('id') id: string,
		@Body() body: CreateSizeOptionAlternativeDto,
	): Promise<SizeOptionAlternative> {
		return this.updateSizeOptionAlternativeUseCase.handle(id, body);
	}

	@Get()
	@ApiOperation({
		summary: 'Listar todas las opciones de talla',
		description:
			'Retorna todas las opciones de talla disponibles para productos textiles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de opciones de talla',
		type: [SizeOptionAlternative],
	})
	async getAllSizeOptionAlternatives(): Promise<SizeOptionAlternative[]> {
		return this.getAllSizeOptionAlternativesUseCase.handle();
	}

	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener opción de talla por ID',
		description: 'Retorna una opción de talla específica por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la opción de talla',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 200,
		description: 'Opción de talla encontrada',
		type: SizeOptionAlternative,
	})
	@ApiResponse({
		status: 404,
		description: 'Opción de talla no encontrada',
	})
	async getByIdSizeOptionAlternative(
		@Param('id') id: string,
	): Promise<SizeOptionAlternative> {
		return this.getByIdSizeOptionAlternativeUseCase.handle(id);
	}

	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar opción de talla',
		description: 'Elimina una opción de talla por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la opción de talla a eliminar',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 204,
		description: 'Opción de talla eliminada exitosamente',
	})
	@ApiResponse({
		status: 404,
		description: 'Opción de talla no encontrada',
	})
	async deleteSizeOptionAlternative(@Param('id') id: string): Promise<void> {
		return this.deleteSizeOptionAlternativeUseCase.handle(id);
	}
}
