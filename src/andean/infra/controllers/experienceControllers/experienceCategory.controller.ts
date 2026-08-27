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
	UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/jwtAuth.guard';
import { RolesGuard } from '../../core/roles.guard';
import { Roles } from '../../core/roles.decorator';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { Public } from '../../core/public.decorator';
import { ExperienceCategoryResponse } from 'src/andean/app/models/experiences/ExperienceCategoryResponse';
import { CreateExperienceCategoryDto } from '../dto/experiences/CreateExperienceCategoryDto';
import { CreateManyExperienceCategoriesDto } from '../dto/experiences/CreateManyExperienceCategoriesDto';
import { CreateExperienceCategoryUseCase } from 'src/andean/app/use_cases/experiences/category/CreateExperienceCategoryUseCase';
import { CreateManyExperienceCategoriesUseCase } from 'src/andean/app/use_cases/experiences/category/CreateManyExperienceCategoriesUseCase';
import { ListExperienceCategoriesUseCase } from 'src/andean/app/use_cases/experiences/category/ListExperienceCategoriesUseCase';
import { GetExperienceCategoryByIdUseCase } from 'src/andean/app/use_cases/experiences/category/GetExperienceCategoryByIdUseCase';
import { UpdateExperienceCategoryUseCase } from 'src/andean/app/use_cases/experiences/category/UpdateExperienceCategoryUseCase';
import { DeleteExperienceCategoryUseCase } from 'src/andean/app/use_cases/experiences/category/DeleteExperienceCategoryUseCase';

@ApiTags('Experience Categories')
@Controller('experiences/categories')
export class ExperienceCategoryController {
	constructor(
		private readonly createExperienceCategoryUseCase: CreateExperienceCategoryUseCase,
		private readonly createManyExperienceCategoriesUseCase: CreateManyExperienceCategoriesUseCase,
		private readonly listExperienceCategoriesUseCase: ListExperienceCategoriesUseCase,
		private readonly getExperienceCategoryByIdUseCase: GetExperienceCategoryByIdUseCase,
		private readonly updateExperienceCategoryUseCase: UpdateExperienceCategoryUseCase,
		private readonly deleteExperienceCategoryUseCase: DeleteExperienceCategoryUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples categorías de experiencia',
		description:
			'Crea múltiples categorías de experiencia en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiResponse({
		status: 201,
		description: 'Categorías creadas exitosamente',
		type: [ExperienceCategoryResponse],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManyCategories(
		@Body() dto: CreateManyExperienceCategoriesDto,
	): Promise<ExperienceCategoryResponse[]> {
		return this.createManyExperienceCategoriesUseCase.handle(dto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva categoría de experiencia',
		description:
			'Crea una nueva categoría para clasificar experiencias (ej: Community Tourism, Ancestral Tourism)',
	})
	@ApiResponse({
		status: 201,
		description: 'Categoría creada exitosamente',
		type: ExperienceCategoryResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createCategory(
		@Body() dto: CreateExperienceCategoryDto,
	): Promise<ExperienceCategoryResponse> {
		return this.createExperienceCategoryUseCase.handle(dto);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Listar todas las categorías de experiencia',
		description:
			'Retorna todas las categorías de experiencias disponibles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de categorías',
		type: [ExperienceCategoryResponse],
	})
	async listCategories(): Promise<ExperienceCategoryResponse[]> {
		return this.listExperienceCategoriesUseCase.handle();
	}

	@Public()
	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener categoría por ID',
		description: 'Retorna una categoría de experiencia específica por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la categoría',
		example: '507f1f77bcf86cd799439011',
	})
	@ApiResponse({
		status: 200,
		description: 'Categoría encontrada',
		type: ExperienceCategoryResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Categoría no encontrada',
	})
	async getCategoryById(
		@Param('id') id: string,
	): Promise<ExperienceCategoryResponse> {
		return this.getExperienceCategoryByIdUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Put('/:id')
	@ApiOperation({
		summary: 'Actualizar categoría de experiencia',
		description: 'Actualiza los datos de una categoría de experiencia existente',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la categoría',
		example: '507f1f77bcf86cd799439011',
	})
	@ApiResponse({
		status: 200,
		description: 'Categoría actualizada exitosamente',
		type: ExperienceCategoryResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Categoría no encontrada',
	})
	async updateCategory(
		@Param('id') id: string,
		@Body() dto: CreateExperienceCategoryDto,
	): Promise<ExperienceCategoryResponse> {
		return this.updateExperienceCategoryUseCase.handle(id, dto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar categoría de experiencia',
		description: 'Elimina una categoría de experiencia por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la categoría a eliminar',
		example: '507f1f77bcf86cd799439011',
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
		await this.deleteExperienceCategoryUseCase.handle(id);
	}
}
