import {
	Controller,
	Get,
	Post,
	Put,
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
import { CreateSuperfoodCategoryDto } from '../dto/superfoods/CreateSuperfoodCategoryDto';
import { CreateManySuperfoodCategoriesDto } from '../dto/superfoods/CreateManySuperfoodCategoriesDto';
import { SuperfoodCategoryResponse } from '../../../app/models/superfoods/SuperfoodCategoryResponse';
import { CreateSuperfoodCategoryUseCase } from '../../../app/use_cases/superfoods/category/CreateSuperfoodCategoryUseCase';
import { CreateManySuperfoodCategoriesUseCase } from '../../../app/use_cases/superfoods/category/CreateManySuperfoodCategoriesUseCase';
import { GetSuperfoodCategoryByIdUseCase } from '../../../app/use_cases/superfoods/category/GetSuperfoodCategoryByIdUseCase';
import { ListSuperfoodCategoriesUseCase } from '../../../app/use_cases/superfoods/category/ListSuperfoodCategoriesUseCase';
import { DeleteSuperfoodCategoryUseCase } from '../../../app/use_cases/superfoods/category/DeleteSuperfoodCategoryUseCase';
import { UpdateSuperfoodCategoryUseCase } from '../../../app/use_cases/superfoods/category/UpdateSuperfoodCategoryUseCase';

@ApiTags('Superfood Categories')
@Controller('superfood-categories')
export class SuperfoodCategoryController {
	constructor(
		private readonly createSuperfoodCategoryUseCase: CreateSuperfoodCategoryUseCase,
		private readonly createManySuperfoodCategoriesUseCase: CreateManySuperfoodCategoriesUseCase,
		private readonly getSuperfoodCategoryByIdUseCase: GetSuperfoodCategoryByIdUseCase,
		private readonly listSuperfoodCategoriesUseCase: ListSuperfoodCategoriesUseCase,
		private readonly deleteSuperfoodCategoryUseCase: DeleteSuperfoodCategoryUseCase,
		private readonly updateSuperfoodCategoryUseCase: UpdateSuperfoodCategoryUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples categorías de superfood',
		description:
			'Crea múltiples categorías de superfood en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiResponse({
		status: 201,
		description: 'Categorías creadas exitosamente',
		type: [SuperfoodCategoryResponse],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManyCategories(
		@Body() dto: CreateManySuperfoodCategoriesDto,
	): Promise<SuperfoodCategoryResponse[]> {
		return await this.createManySuperfoodCategoriesUseCase.handle(dto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva categoría de superfood',
		description:
			'Crea una nueva categoría para clasificar productos superfood (ej: Quinua, Maca, Cacao)',
	})
	@ApiResponse({
		status: 201,
		description: 'Categoría creada exitosamente',
		type: SuperfoodCategoryResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createCategory(
		@Body() dto: CreateSuperfoodCategoryDto,
	): Promise<SuperfoodCategoryResponse> {
		return await this.createSuperfoodCategoryUseCase.handle(dto);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Listar todas las categorías',
		description: 'Retorna todas las categorías de superfood disponibles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de categorías',
		type: [SuperfoodCategoryResponse],
	})
	async listCategories(): Promise<SuperfoodCategoryResponse[]> {
		return await this.listSuperfoodCategoriesUseCase.handle();
	}

	@Public()
	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener categoría por ID',
		description: 'Retorna una categoría específica por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la categoría',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 200,
		description: 'Categoría encontrada',
		type: SuperfoodCategoryResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Categoría no encontrada',
	})
	async getCategoryById(
		@Param('id') id: string,
	): Promise<SuperfoodCategoryResponse> {
		return await this.getSuperfoodCategoryByIdUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Put('/:id')
	@ApiOperation({
		summary: 'Actualizar categoría',
		description: 'Actualiza una categoría de superfood por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la categoría',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 200,
		description: 'Categoría actualizada exitosamente',
		type: SuperfoodCategoryResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Categoría no encontrada',
	})
	async updateCategory(
		@Param('id') id: string,
		@Body() dto: CreateSuperfoodCategoryDto,
	): Promise<SuperfoodCategoryResponse> {
		return await this.updateSuperfoodCategoryUseCase.handle(id, dto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar categoría',
		description: 'Elimina una categoría de superfood por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la categoría a eliminar',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 204,
		description: 'Categoría eliminada exitosamente',
	})
	@ApiResponse({
		status: 404,
		description: 'Categoría no encontrada',
	})
	async deleteCategory(@Param('id') id: string): Promise<void> {
		await this.deleteSuperfoodCategoryUseCase.handle(id);
	}

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener categoría por ID',
	// 	description: 'Retorna una categoría específica por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la categoría',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Categoría encontrada',
	// 	type: SuperfoodCategoryResponse,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Categoría no encontrada',
	// })
	// async getCategoryById(
	// 	@Param('id') id: string,
	// ): Promise<SuperfoodCategoryResponse> {
	// 	return await this.getSuperfoodCategoryByIdUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar categoría',
	// 	description: 'Elimina una categoría de superfood por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la categoría a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Categoría eliminada exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Categoría no encontrada',
	// })
	// async deleteCategory(@Param('id') id: string): Promise<void> {
	// 	await this.deleteSuperfoodCategoryUseCase.handle(id);
	// }
}
