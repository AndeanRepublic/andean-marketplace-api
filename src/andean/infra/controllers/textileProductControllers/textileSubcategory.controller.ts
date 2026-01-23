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
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
} from '@nestjs/swagger';
import { CreateTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileSubcategoryUseCase';
import { TextileSubcategory } from 'src/andean/domain/entities/textileProducts/TextileSubcategory';
import { CreateTextileSubcategoryDto } from '../dto/textileProducts/CreateTextileSubcategoryDto';
import { UpdateTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileSubcategoryUseCase';
import { GetAllTextileSubcategoriesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileSubcategoriesUseCase';
import { GetByIdTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileSubcategoryUseCase';
import { DeleteTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileSubcategoryUseCase';

@ApiTags('Textile Subcategories')
@Controller('textile-products/subcategories')
export class TextileSubcategoryController {
	constructor(
		private readonly createTextileSubcategoryUseCase: CreateTextileSubcategoryUseCase,
		private readonly updateTextileSubcategoryUseCase: UpdateTextileSubcategoryUseCase,
		private readonly getAllTextileSubcategoriesUseCase: GetAllTextileSubcategoriesUseCase,
		private readonly getByIdTextileSubcategoryUseCase: GetByIdTextileSubcategoryUseCase,
		private readonly deleteTextileSubcategoryUseCase: DeleteTextileSubcategoryUseCase,
	) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva subcategoría textil',
		description: 'Crea una nueva subcategoría para clasificar productos textiles de manera más específica (ej: Ponchos de Alpaca, Mantas de Lana)',
	})
	@ApiResponse({
		status: 201,
		description: 'Subcategoría creada exitosamente',
		type: TextileSubcategory,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createTextileSubcategory(
		@Body() body: CreateTextileSubcategoryDto,
	): Promise<TextileSubcategory> {
		return this.createTextileSubcategoryUseCase.handle(body);
	}

	// @Put('/:id')
	// @ApiOperation({
	// 	summary: 'Actualizar subcategoría textil',
	// 	description: 'Actualiza los datos de una subcategoría textil existente',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la subcategoría',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Subcategoría actualizada exitosamente',
	// 	type: TextileSubcategory,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Subcategoría no encontrada',
	// })
	// async updateTextileSubcategory(
	// 	@Param('id') id: string,
	// 	@Body() body: CreateTextileSubcategoryDto,
	// ): Promise<TextileSubcategory> {
	// 	return this.updateTextileSubcategoryUseCase.handle(id, body);
	// }

	// @Get()
	// @ApiOperation({
	// 	summary: 'Listar todas las subcategorías textiles',
	// 	description: 'Retorna todas las subcategorías de productos textiles disponibles',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Lista de subcategorías',
	// 	type: [TextileSubcategory],
	// })
	// async getAllTextileSubcategories(): Promise<TextileSubcategory[]> {
	// 	return this.getAllTextileSubcategoriesUseCase.handle();
	// }

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener subcategoría por ID',
	// 	description: 'Retorna una subcategoría textil específica por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la subcategoría',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Subcategoría encontrada',
	// 	type: TextileSubcategory,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Subcategoría no encontrada',
	// })
	// async getByIdTextileSubcategory(
	// 	@Param('id') id: string,
	// ): Promise<TextileSubcategory> {
	// 	return this.getByIdTextileSubcategoryUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar subcategoría textil',
	// 	description: 'Elimina una subcategoría textil por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la subcategoría a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Subcategoría eliminada exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Subcategoría no encontrada',
	// })
	// async deleteTextileSubcategory(@Param('id') id: string): Promise<void> {
	// 	return this.deleteTextileSubcategoryUseCase.handle(id);
	// }
}
