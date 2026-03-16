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
import { CreateSuperfoodSalesUnitSizeDto } from '../dto/superfoods/CreateSuperfoodSalesUnitSizeDto';
import { CreateManySuperfoodSalesUnitSizesDto } from '../dto/superfoods/CreateManySuperfoodSalesUnitSizesDto';
import { SuperfoodSalesUnitSizeResponse } from '../../../app/modules/superfoods/SuperfoodSalesUnitSizeResponse';
import { CreateSuperfoodSalesUnitSizeUseCase } from '../../../app/use_cases/superfoods/salesUnitSize/CreateSuperfoodSalesUnitSizeUseCase';
import { CreateManySuperfoodSalesUnitSizesUseCase } from '../../../app/use_cases/superfoods/salesUnitSize/CreateManySuperfoodSalesUnitSizesUseCase';
import { GetSuperfoodSalesUnitSizeByIdUseCase } from '../../../app/use_cases/superfoods/salesUnitSize/GetSuperfoodSalesUnitSizeByIdUseCase';
import { ListSuperfoodSalesUnitSizesUseCase } from '../../../app/use_cases/superfoods/salesUnitSize/ListSuperfoodSalesUnitSizesUseCase';
import { DeleteSuperfoodSalesUnitSizeUseCase } from '../../../app/use_cases/superfoods/salesUnitSize/DeleteSuperfoodSalesUnitSizeUseCase';

@ApiTags('Superfood Sales Unit Sizes')
@Controller('superfood-sales-unit-sizes')
export class SuperfoodSalesUnitSizeController {
	constructor(
		private readonly createSuperfoodSalesUnitSizeUseCase: CreateSuperfoodSalesUnitSizeUseCase,
		private readonly createManySuperfoodSalesUnitSizesUseCase: CreateManySuperfoodSalesUnitSizesUseCase,
		private readonly getSuperfoodSalesUnitSizeByIdUseCase: GetSuperfoodSalesUnitSizeByIdUseCase,
		private readonly listSuperfoodSalesUnitSizesUseCase: ListSuperfoodSalesUnitSizesUseCase,
		private readonly deleteSuperfoodSalesUnitSizeUseCase: DeleteSuperfoodSalesUnitSizeUseCase,
	) {}

	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples tamaños de unidad de venta',
		description:
			'Crea múltiples tamaños de unidad de venta en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiResponse({
		status: 201,
		description: 'Tamaños creados exitosamente',
		type: [SuperfoodSalesUnitSizeResponse],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManySalesUnitSizes(
		@Body() dto: CreateManySuperfoodSalesUnitSizesDto,
	): Promise<SuperfoodSalesUnitSizeResponse[]> {
		return await this.createManySuperfoodSalesUnitSizesUseCase.handle(dto);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo tamaño de unidad de venta',
		description: 'Crea un nuevo tamaño de unidad (ej: 500g, 1kg, 250g)',
	})
	@ApiResponse({
		status: 201,
		description: 'Tamaño creado exitosamente',
		type: SuperfoodSalesUnitSizeResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createSalesUnitSize(
		@Body() dto: CreateSuperfoodSalesUnitSizeDto,
	): Promise<SuperfoodSalesUnitSizeResponse> {
		return await this.createSuperfoodSalesUnitSizeUseCase.handle(dto);
	}

	@Get()
	@ApiOperation({
		summary: 'Listar todos los tamaños de unidad',
		description: 'Retorna todos los tamaños de unidad de venta disponibles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de tamaños',
		type: [SuperfoodSalesUnitSizeResponse],
	})
	async listSalesUnitSizes(): Promise<SuperfoodSalesUnitSizeResponse[]> {
		return await this.listSuperfoodSalesUnitSizesUseCase.handle();
	}

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener tamaño por ID',
	// 	description: 'Retorna un tamaño de unidad específico por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del tamaño',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Tamaño encontrado',
	// 	type: SuperfoodSalesUnitSizeResponse,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Tamaño no encontrado',
	// })
	// async getSalesUnitSizeById(
	// 	@Param('id') id: string,
	// ): Promise<SuperfoodSalesUnitSizeResponse> {
	// 	return await this.getSuperfoodSalesUnitSizeByIdUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar tamaño de unidad',
	// 	description: 'Elimina un tamaño de unidad de venta por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del tamaño a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Tamaño eliminado exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Tamaño no encontrado',
	// })
	// async deleteSalesUnitSize(@Param('id') id: string): Promise<void> {
	// 	await this.deleteSuperfoodSalesUnitSizeUseCase.handle(id);
	// }
}
