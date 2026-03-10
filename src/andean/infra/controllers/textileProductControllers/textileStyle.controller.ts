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
import { TextileStyleResponse } from 'src/andean/app/modules/textile/TextileStyleResponse';
import { CreateTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileStyleUseCase';
import { CreateManyTextileStylesUseCase } from 'src/andean/app/use_cases/textileProducts/CreateManyTextileStylesUseCase';
import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { CreateTextileStyleDto } from '../dto/textileProducts/CreateTextileStyleDto';
import { CreateManyTextileStylesDto } from '../dto/textileProducts/CreateManyTextileStylesDto';
import { UpdateTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileStyleUseCase';
import { GetAllTextileStylesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileStylesUseCase';
import { GetByIdTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileStyleUseCase';
import { DeleteTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileStyleUseCase';

@ApiTags('Textile Styles')
@Controller('textile-products/styles')
export class TextileStyleController {
	constructor(
		private readonly createTextileStyleUseCase: CreateTextileStyleUseCase,
		private readonly createManyTextileStylesUseCase: CreateManyTextileStylesUseCase,
		private readonly updateTextileStyleUseCase: UpdateTextileStyleUseCase,
		private readonly getAllTextileStylesUseCase: GetAllTextileStylesUseCase,
		private readonly getByIdTextileStyleUseCase: GetByIdTextileStyleUseCase,
		private readonly deleteTextileStyleUseCase: DeleteTextileStyleUseCase,
	) {}

	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples estilos textiles',
		description:
			'Crea múltiples estilos textiles en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiResponse({
		status: 201,
		description: 'Estilos creados exitosamente',
		type: [TextileStyle],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManyTextileStyles(
		@Body() body: CreateManyTextileStylesDto,
	): Promise<TextileStyle[]> {
		return this.createManyTextileStylesUseCase.handle(body);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo estilo textil',
		description:
			'Crea un nuevo estilo para productos textiles (ej: Tradicional, Moderno, Étnico, Contemporáneo)',
	})
	@ApiResponse({
		status: 201,
		description: 'Estilo creado exitosamente',
		type: TextileStyle,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createTextileStyle(
		@Body() body: CreateTextileStyleDto,
	): Promise<TextileStyle> {
		return this.createTextileStyleUseCase.handle(body);
	}

	// @Put('/:id')
	// @ApiOperation({
	// 	summary: 'Actualizar estilo textil',
	// 	description: 'Actualiza los datos de un estilo textil existente',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del estilo',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Estilo actualizado exitosamente',
	// 	type: TextileStyle,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Estilo no encontrado',
	// })
	// async updateTextileStyle(
	// 	@Param('id') id: string,
	// 	@Body() body: CreateTextileStyleDto,
	// ): Promise<TextileStyle> {
	// 	return this.updateTextileStyleUseCase.handle(id, body);
	// }

	@Get()
	@ApiOperation({
		summary: 'Listar todos los estilos textiles',
		description: 'Retorna todos los estilos textiles disponibles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de estilos',
		type: [TextileStyleResponse],
	})
	async getAllTextileStyles(): Promise<TextileStyle[]> {
		return this.getAllTextileStylesUseCase.handle();
	}

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener estilo por ID',
	// 	description: 'Retorna un estilo textil específico por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del estilo',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Estilo encontrado',
	// 	type: TextileStyle,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Estilo no encontrado',
	// })
	// async getByIdTextileStyle(@Param('id') id: string): Promise<TextileStyle> {
	// 	return this.getByIdTextileStyleUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar estilo textil',
	// 	description: 'Elimina un estilo textil por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del estilo a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Estilo eliminado exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Estilo no encontrado',
	// })
	// async deleteTextileStyle(@Param('id') id: string): Promise<void> {
	// 	return this.deleteTextileStyleUseCase.handle(id);
	// }
}
