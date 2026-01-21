import {
	Controller,
	Get,
	Post,
	Delete,
	Body,
	Param,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
} from '@nestjs/swagger';
import { CreateSuperfoodPreservationMethodDto } from '../dto/superfoods/CreateSuperfoodPreservationMethodDto';
import { SuperfoodPreservationMethodResponse } from '../../../app/modules/SuperfoodPreservationMethodResponse';
import { CreateSuperfoodPreservationMethodUseCase } from '../../../app/use_cases/superfoods/preservationMethod/CreateSuperfoodPreservationMethodUseCase';
import { GetSuperfoodPreservationMethodByIdUseCase } from '../../../app/use_cases/superfoods/preservationMethod/GetSuperfoodPreservationMethodByIdUseCase';
import { ListSuperfoodPreservationMethodsUseCase } from '../../../app/use_cases/superfoods/preservationMethod/ListSuperfoodPreservationMethodsUseCase';
import { DeleteSuperfoodPreservationMethodUseCase } from '../../../app/use_cases/superfoods/preservationMethod/DeleteSuperfoodPreservationMethodUseCase';

@ApiTags('Superfood Preservation Methods')
@Controller('superfood-preservation-methods')
export class SuperfoodPreservationMethodController {
	constructor(
		private readonly createSuperfoodPreservationMethodUseCase: CreateSuperfoodPreservationMethodUseCase,
		private readonly getSuperfoodPreservationMethodByIdUseCase: GetSuperfoodPreservationMethodByIdUseCase,
		private readonly listSuperfoodPreservationMethodsUseCase: ListSuperfoodPreservationMethodsUseCase,
		private readonly deleteSuperfoodPreservationMethodUseCase: DeleteSuperfoodPreservationMethodUseCase,
	) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo método de preservación',
		description: 'Crea un nuevo método de preservación (ej: Deshidratado, Liofilizado)',
	})
	@ApiResponse({
		status: 201,
		description: 'Método creado exitosamente',
		type: SuperfoodPreservationMethodResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createPreservationMethod(
		@Body() dto: CreateSuperfoodPreservationMethodDto,
	): Promise<SuperfoodPreservationMethodResponse> {
		return await this.createSuperfoodPreservationMethodUseCase.handle(dto);
	}

	@Get()
	@ApiOperation({
		summary: 'Listar todos los métodos de preservación',
		description: 'Retorna todos los métodos de preservación disponibles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de métodos',
		type: [SuperfoodPreservationMethodResponse],
	})
	async listPreservationMethods(): Promise<SuperfoodPreservationMethodResponse[]> {
		return await this.listSuperfoodPreservationMethodsUseCase.handle();
	}

	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener método por ID',
		description: 'Retorna un método de preservación específico por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID del método',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 200,
		description: 'Método encontrado',
		type: SuperfoodPreservationMethodResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Método no encontrado',
	})
	async getPreservationMethodById(
		@Param('id') id: string,
	): Promise<SuperfoodPreservationMethodResponse> {
		return await this.getSuperfoodPreservationMethodByIdUseCase.handle(id);
	}

	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar método de preservación',
		description: 'Elimina un método de preservación por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID del método a eliminar',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 204,
		description: 'Método eliminado exitosamente',
	})
	@ApiResponse({
		status: 404,
		description: 'Método no encontrado',
	})
	async deletePreservationMethod(@Param('id') id: string): Promise<void> {
		await this.deleteSuperfoodPreservationMethodUseCase.handle(id);
	}
}
