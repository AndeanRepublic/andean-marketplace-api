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
import { TextileCategoryResponse } from 'src/andean/app/modules/textile/TextileCategoryResponse';
import { CreateTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileCategoryUseCase';
import { CreateManyTextileCategoriesUseCase } from 'src/andean/app/use_cases/textileProducts/CreateManyTextileCategoriesUseCase';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { CreateTextileCategoryDto } from '../dto/textileProducts/CreateTextileCategory';
import { CreateManyTextileCategoriesDto } from '../dto/textileProducts/CreateManyTextileCategoriesDto';
import { UpdateTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileCategoryUseCase';
import { GetAllTextileCategoriesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileCategoriesUseCase';
import { GetByIdTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileCategoryUseCase';
import { DeleteTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileCategoryUseCase';

@ApiTags('Textile Categories')
@Controller('textile-products/categories')
export class TextileCategoryController {
	constructor(
		private readonly createTextileCategoryUseCase: CreateTextileCategoryUseCase,
		private readonly createManyTextileCategoriesUseCase: CreateManyTextileCategoriesUseCase,
		private readonly updateTextileCategoryUseCase: UpdateTextileCategoryUseCase,
		private readonly getAllTextileCategoriesUseCase: GetAllTextileCategoriesUseCase,
		private readonly getByIdTextileCategoryUseCase: GetByIdTextileCategoryUseCase,
		private readonly deleteTextileCategoryUseCase: DeleteTextileCategoryUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples categorías textiles',
		description:
			'Crea múltiples categorías textiles en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiResponse({
		status: 201,
		description: 'Categorías creadas exitosamente',
		type: [TextileCategory],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManyTextileCategories(
		@Body() body: CreateManyTextileCategoriesDto,
	): Promise<TextileCategory[]> {
		return this.createManyTextileCategoriesUseCase.handle(body);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva categoría textil',
		description:
			'Crea una nueva categoría para clasificar productos textiles (ej: Ponchos, Mantas, Bolsos, Chullos)',
	})
	@ApiResponse({
		status: 201,
		description: 'Categoría creada exitosamente',
		type: TextileCategory,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createTextileCategory(
		@Body() body: CreateTextileCategoryDto,
	): Promise<TextileCategory> {
		return this.createTextileCategoryUseCase.handle(body);
	}

	// @Put('/:id')
	// @ApiOperation({
	// 	summary: 'Actualizar categoría textil',
	// 	description: 'Actualiza los datos de una categoría textil existente',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la categoría',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Categoría actualizada exitosamente',
	// 	type: TextileCategory,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Categoría no encontrada',
	// })
	// async updateTextileCategory(
	// 	@Param('id') id: string,
	// 	@Body() body: CreateTextileCategoryDto,
	// ): Promise<TextileCategory> {
	// 	return this.updateTextileCategoryUseCase.handle(id, body);
	// }

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Listar todas las categorías textiles',
		description:
			'Retorna todas las categorías de productos textiles disponibles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de categorías',
		type: [TextileCategoryResponse],
	})
	async getAllTextileCategories(): Promise<TextileCategory[]> {
		return this.getAllTextileCategoriesUseCase.handle();
	}

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener categoría por ID',
	// 	description: 'Retorna una categoría textil específica por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la categoría',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Categoría encontrada',
	// 	type: TextileCategory,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Categoría no encontrada',
	// })
	// async getByIdTextileCategory(
	// 	@Param('id') id: string,
	// ): Promise<TextileCategory> {
	// 	return this.getByIdTextileCategoryUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar categoría textil',
	// 	description: 'Elimina una categoría textil por su ID',
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
	// async deleteTextileCategory(@Param('id') id: string): Promise<void> {
	// 	return this.deleteTextileCategoryUseCase.handle(id);
	// }
}
