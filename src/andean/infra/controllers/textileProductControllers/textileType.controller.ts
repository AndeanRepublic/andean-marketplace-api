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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileTypeUseCase';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';
import { CreateTextileTypeDto } from '../dto/textileProducts/CreateTextileTypeDto';
import { UpdateTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileTypeUseCase';
import { GetAllTextileTypesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileTypesUseCase';
import { GetByIdTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileTypeUseCase';
import { DeleteTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileTypeUseCase';

@ApiTags('Textile Types')
@Controller('textile-products/types')
export class TextileTypeController {
	constructor(
		private readonly createTextileTypeUseCase: CreateTextileTypeUseCase,
		private readonly updateTextileTypeUseCase: UpdateTextileTypeUseCase,
		private readonly getAllTextileTypesUseCase: GetAllTextileTypesUseCase,
		private readonly getByIdTextileTypeUseCase: GetByIdTextileTypeUseCase,
		private readonly deleteTextileTypeUseCase: DeleteTextileTypeUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo tipo de textil',
		description:
			'Crea un nuevo tipo de textil para clasificar productos (ej: Lana de Alpaca, Algodón Orgánico, Lana de Oveja)',
	})
	@ApiResponse({
		status: 201,
		description: 'Tipo creado exitosamente',
		type: TextileType,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createTextileType(
		@Body() body: CreateTextileTypeDto,
	): Promise<TextileType> {
		return this.createTextileTypeUseCase.handle(body);
	}

	// @Put('/:id')
	// @ApiOperation({
	// 	summary: 'Actualizar tipo de textil',
	// 	description: 'Actualiza los datos de un tipo de textil existente',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del tipo',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Tipo actualizado exitosamente',
	// 	type: TextileType,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Tipo no encontrado',
	// })
	// async updateTextileType(
	// 	@Param('id') id: string,
	// 	@Body() body: CreateTextileTypeDto,
	// ): Promise<TextileType> {
	// 	return this.updateTextileTypeUseCase.handle(id, body);
	// }

	// @Get()
	// @ApiOperation({
	// 	summary: 'Listar todos los tipos de textil',
	// 	description: 'Retorna todos los tipos de textil disponibles',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Lista de tipos',
	// 	type: [TextileType],
	// })
	// async getAllTextileTypes(): Promise<TextileType[]> {
	// 	return this.getAllTextileTypesUseCase.handle();
	// }

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener tipo por ID',
	// 	description: 'Retorna un tipo de textil específico por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del tipo',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Tipo encontrado',
	// 	type: TextileType,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Tipo no encontrado',
	// })
	// async getByIdTextileType(@Param('id') id: string): Promise<TextileType> {
	// 	return this.getByIdTextileTypeUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar tipo de textil',
	// 	description: 'Elimina un tipo de textil por su ID',
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
	// async deleteTextileType(@Param('id') id: string): Promise<void> {
	// 	return this.deleteTextileTypeUseCase.handle(id);
	// }
}
