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
import { CreateSuperfoodProductPresentationDto } from '../dto/superfoods/CreateSuperfoodProductPresentationDto';
import { SuperfoodProductPresentationResponse } from '../../../app/modules/SuperfoodProductPresentationResponse';
import { CreateSuperfoodProductPresentationUseCase } from '../../../app/use_cases/superfoods/productPresentation/CreateSuperfoodProductPresentationUseCase';
import { GetSuperfoodProductPresentationByIdUseCase } from '../../../app/use_cases/superfoods/productPresentation/GetSuperfoodProductPresentationByIdUseCase';
import { ListSuperfoodProductPresentationsUseCase } from '../../../app/use_cases/superfoods/productPresentation/ListSuperfoodProductPresentationsUseCase';
import { DeleteSuperfoodProductPresentationUseCase } from '../../../app/use_cases/superfoods/productPresentation/DeleteSuperfoodProductPresentationUseCase';

@ApiTags('Superfood Product Presentations')
@Controller('superfood-product-presentations')
export class SuperfoodProductPresentationController {
	constructor(
		private readonly createSuperfoodProductPresentationUseCase: CreateSuperfoodProductPresentationUseCase,
		private readonly getSuperfoodProductPresentationByIdUseCase: GetSuperfoodProductPresentationByIdUseCase,
		private readonly listSuperfoodProductPresentationsUseCase: ListSuperfoodProductPresentationsUseCase,
		private readonly deleteSuperfoodProductPresentationUseCase: DeleteSuperfoodProductPresentationUseCase,
	) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva presentación de producto',
		description: 'Crea una nueva presentación (ej: En polvo, En grano, Cápsulas)',
	})
	@ApiResponse({
		status: 201,
		description: 'Presentación creada exitosamente',
		type: SuperfoodProductPresentationResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createProductPresentation(
		@Body() dto: CreateSuperfoodProductPresentationDto,
	): Promise<SuperfoodProductPresentationResponse> {
		return await this.createSuperfoodProductPresentationUseCase.handle(dto);
	}

	@Get()
	@ApiOperation({
		summary: 'Listar todas las presentaciones',
		description: 'Retorna todas las presentaciones de producto disponibles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de presentaciones',
		type: [SuperfoodProductPresentationResponse],
	})
	async listProductPresentations(): Promise<SuperfoodProductPresentationResponse[]> {
		return await this.listSuperfoodProductPresentationsUseCase.handle();
	}

	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener presentación por ID',
		description: 'Retorna una presentación específica por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la presentación',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 200,
		description: 'Presentación encontrada',
		type: SuperfoodProductPresentationResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Presentación no encontrada',
	})
	async getProductPresentationById(
		@Param('id') id: string,
	): Promise<SuperfoodProductPresentationResponse> {
		return await this.getSuperfoodProductPresentationByIdUseCase.handle(id);
	}

	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar presentación',
		description: 'Elimina una presentación de producto por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la presentación a eliminar',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 204,
		description: 'Presentación eliminada exitosamente',
	})
	@ApiResponse({
		status: 404,
		description: 'Presentación no encontrada',
	})
	async deleteProductPresentation(@Param('id') id: string): Promise<void> {
		await this.deleteSuperfoodProductPresentationUseCase.handle(id);
	}
}
