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
import { CreateSuperfoodCategoryDto } from '../dto/superfoods/CreateSuperfoodCategoryDto';
import { SuperfoodCategoryResponse } from '../../../app/modules/superfoods/SuperfoodCategoryResponse';
import { CreateSuperfoodCategoryUseCase } from '../../../app/use_cases/superfoods/category/CreateSuperfoodCategoryUseCase';
import { GetSuperfoodCategoryByIdUseCase } from '../../../app/use_cases/superfoods/category/GetSuperfoodCategoryByIdUseCase';
import { ListSuperfoodCategoriesUseCase } from '../../../app/use_cases/superfoods/category/ListSuperfoodCategoriesUseCase';
import { DeleteSuperfoodCategoryUseCase } from '../../../app/use_cases/superfoods/category/DeleteSuperfoodCategoryUseCase';

@ApiTags('Superfood Categories')
@Controller('superfood-categories')
export class SuperfoodCategoryController {
	constructor(
		private readonly createSuperfoodCategoryUseCase: CreateSuperfoodCategoryUseCase,
		private readonly getSuperfoodCategoryByIdUseCase: GetSuperfoodCategoryByIdUseCase,
		private readonly listSuperfoodCategoriesUseCase: ListSuperfoodCategoriesUseCase,
		private readonly deleteSuperfoodCategoryUseCase: DeleteSuperfoodCategoryUseCase,
	) {}

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

	// @Get()
	// @ApiOperation({
	// 	summary: 'Listar todas las categorías',
	// 	description: 'Retorna todas las categorías de superfood disponibles',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Lista de categorías',
	// 	type: [SuperfoodCategoryResponse],
	// })
	// async listCategories(): Promise<SuperfoodCategoryResponse[]> {
	// 	return await this.listSuperfoodCategoriesUseCase.handle();
	// }

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
