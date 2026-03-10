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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateSuperfoodTypeDto } from '../dto/superfoods/CreateSuperfoodTypeDto';
import { SuperfoodTypeResponse } from '../../../app/modules/superfoods/SuperfoodTypeResponse';
import { CreateSuperfoodTypeUseCase } from '../../../app/use_cases/superfoods/type/CreateSuperfoodTypeUseCase';
import { GetSuperfoodTypeByIdUseCase } from '../../../app/use_cases/superfoods/type/GetSuperfoodTypeByIdUseCase';
import { ListSuperfoodTypesUseCase } from '../../../app/use_cases/superfoods/type/ListSuperfoodTypesUseCase';
import { DeleteSuperfoodTypeUseCase } from '../../../app/use_cases/superfoods/type/DeleteSuperfoodTypeUseCase';

@ApiTags('Superfood Types')
@Controller('superfood-types')
export class SuperfoodTypeController {
	constructor(
		private readonly createSuperfoodTypeUseCase: CreateSuperfoodTypeUseCase,
		private readonly getSuperfoodTypeByIdUseCase: GetSuperfoodTypeByIdUseCase,
		private readonly listSuperfoodTypesUseCase: ListSuperfoodTypesUseCase,
		private readonly deleteSuperfoodTypeUseCase: DeleteSuperfoodTypeUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo tipo de superfood',
		description: 'Crea un nuevo tipo de superfood (ej: Grano, Semilla, Raíz)',
	})
	@ApiResponse({
		status: 201,
		description: 'Tipo creado exitosamente',
		type: SuperfoodTypeResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createType(
		@Body() dto: CreateSuperfoodTypeDto,
	): Promise<SuperfoodTypeResponse> {
		return await this.createSuperfoodTypeUseCase.handle(dto);
	}

	// @Get()
	// @ApiOperation({
	// 	summary: 'Listar todos los tipos',
	// 	description: 'Retorna todos los tipos de superfood disponibles',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Lista de tipos',
	// 	type: [SuperfoodTypeResponse],
	// })
	// async listTypes(): Promise<SuperfoodTypeResponse[]> {
	// 	return await this.listSuperfoodTypesUseCase.handle();
	// }

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener tipo por ID',
	// 	description: 'Retorna un tipo específico por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del tipo',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Tipo encontrado',
	// 	type: SuperfoodTypeResponse,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Tipo no encontrado',
	// })
	// async getTypeById(@Param('id') id: string): Promise<SuperfoodTypeResponse> {
	// 	return await this.getSuperfoodTypeByIdUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar tipo',
	// 	description: 'Elimina un tipo de superfood por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del tipo a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Tipo eliminado exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Tipo no encontrado',
	// })
	// async deleteType(@Param('id') id: string): Promise<void> {
	// 	await this.deleteSuperfoodTypeUseCase.handle(id);
	// }
}
