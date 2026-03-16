import {
	Controller,
	Get,
	Post,
	Delete,
	Body,
	Param,
	HttpCode,
	HttpStatus,
	UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/jwtAuth.guard';
import { RolesGuard } from '../../core/roles.guard';
import { Roles } from '../../core/roles.decorator';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { Public } from '../../core/public.decorator';
import { CreateSuperfoodProductPresentationDto } from '../dto/superfoods/CreateSuperfoodProductPresentationDto';
import { CreateManySuperfoodProductPresentationsDto } from '../dto/superfoods/CreateManySuperfoodProductPresentationsDto';
import { SuperfoodProductPresentationResponse } from '../../../app/modules/superfoods/SuperfoodProductPresentationResponse';
import { CreateSuperfoodProductPresentationUseCase } from '../../../app/use_cases/superfoods/productPresentation/CreateSuperfoodProductPresentationUseCase';
import { CreateManySuperfoodProductPresentationsUseCase } from '../../../app/use_cases/superfoods/productPresentation/CreateManySuperfoodProductPresentationsUseCase';
import { GetSuperfoodProductPresentationByIdUseCase } from '../../../app/use_cases/superfoods/productPresentation/GetSuperfoodProductPresentationByIdUseCase';
import { ListSuperfoodProductPresentationsUseCase } from '../../../app/use_cases/superfoods/productPresentation/ListSuperfoodProductPresentationsUseCase';
import { DeleteSuperfoodProductPresentationUseCase } from '../../../app/use_cases/superfoods/productPresentation/DeleteSuperfoodProductPresentationUseCase';

@ApiTags('Superfood Product Presentations')
@Controller('superfood-product-presentations')
export class SuperfoodProductPresentationController {
	constructor(
		private readonly createSuperfoodProductPresentationUseCase: CreateSuperfoodProductPresentationUseCase,
		private readonly createManySuperfoodProductPresentationsUseCase: CreateManySuperfoodProductPresentationsUseCase,
		private readonly getSuperfoodProductPresentationByIdUseCase: GetSuperfoodProductPresentationByIdUseCase,
		private readonly listSuperfoodProductPresentationsUseCase: ListSuperfoodProductPresentationsUseCase,
		private readonly deleteSuperfoodProductPresentationUseCase: DeleteSuperfoodProductPresentationUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples presentaciones de producto',
		description:
			'Crea múltiples presentaciones de producto en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiResponse({
		status: 201,
		description: 'Presentaciones creadas exitosamente',
		type: [SuperfoodProductPresentationResponse],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManyProductPresentations(
		@Body() dto: CreateManySuperfoodProductPresentationsDto,
	): Promise<SuperfoodProductPresentationResponse[]> {
		return await this.createManySuperfoodProductPresentationsUseCase.handle(
			dto,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva presentación de producto',
		description:
			'Crea una nueva presentación (ej: En polvo, En grano, Cápsulas)',
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

	@Public()
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
	async listProductPresentations(): Promise<
		SuperfoodProductPresentationResponse[]
	> {
		return await this.listSuperfoodProductPresentationsUseCase.handle();
	}

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener presentación por ID',
	// 	description: 'Retorna una presentación específica por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la presentación',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Presentación encontrada',
	// 	type: SuperfoodProductPresentationResponse,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Presentación no encontrada',
	// })
	// async getProductPresentationById(
	// 	@Param('id') id: string,
	// ): Promise<SuperfoodProductPresentationResponse> {
	// 	return await this.getSuperfoodProductPresentationByIdUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar presentación',
	// 	description: 'Elimina una presentación de producto por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la presentación a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Presentación eliminada exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Presentación no encontrada',
	// })
	// async deleteProductPresentation(@Param('id') id: string): Promise<void> {
	// 	await this.deleteSuperfoodProductPresentationUseCase.handle(id);
	// }
}
