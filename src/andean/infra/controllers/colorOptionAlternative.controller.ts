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
import { JwtAuthGuard } from 'src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from 'src/andean/infra/core/roles.guard';
import { Roles } from 'src/andean/infra/core/roles.decorator';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { Public } from 'src/andean/infra/core/public.decorator';
import { CreateColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/CreateColorOptionAlternativeUseCase';
import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';
import { CreateColorOptionAlternativeDto } from './dto/textileProducts/CreateColorOptionAlternativeDto';
import { GetAllColorOptionAlternativesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllColorOptionAlternativesUseCase';
import { GetByIdColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdColorOptionAlternativeUseCase';
import { UpdateColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateColorOptionAlternativeUseCase';
import { DeleteColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteColorOptionAlternativeUseCase';
import { CreateManyColorOptionAlternativesUseCase } from 'src/andean/app/use_cases/textileProducts/CreateManyColorOptionAlternativesUseCase';
import { CreateManyColorOptionAlternativesDto } from './dto/textileProducts/CreateManyColorOptionAlternativesDto';

@ApiTags('Textile Color Options')
@Controller('textile-products/color-option-alternatives')
export class ColorOptionAlternativeController {
	constructor(
		private readonly createColorOptionAlternativeUseCase: CreateColorOptionAlternativeUseCase,
		private readonly updateColorOptionAlternativeUseCase: UpdateColorOptionAlternativeUseCase,
		private readonly getAllColorOptionAlternativesUseCase: GetAllColorOptionAlternativesUseCase,
		private readonly getByIdColorOptionAlternativeUseCase: GetByIdColorOptionAlternativeUseCase,
		private readonly deleteColorOptionAlternativeUseCase: DeleteColorOptionAlternativeUseCase,
		private readonly createManyColorOptionAlternativesUseCase: CreateManyColorOptionAlternativesUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@ApiOperation({
		summary: 'Crear nueva opción de color',
		description:
			'Crea una nueva opción de color para variantes de productos textiles (ej: Rojo Andino, Azul Inca, Verde Selva)',
	})
	@ApiResponse({
		status: 201,
		description: 'Opción de color creada exitosamente',
		type: ColorOptionAlternative,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createColorOptionAlternative(
		@Body() body: CreateColorOptionAlternativeDto,
	): Promise<ColorOptionAlternative> {
		return this.createColorOptionAlternativeUseCase.handle(body);
	}

	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@ApiOperation({
		summary: 'Crear múltiples opciones de color',
		description:
			'Crea múltiples opciones de color en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiResponse({
		status: 201,
		description: 'Opciones de color creadas exitosamente',
		type: [ColorOptionAlternative],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManyColorOptionAlternatives(
		@Body() body: CreateManyColorOptionAlternativesDto,
	): Promise<ColorOptionAlternative[]> {
		return this.createManyColorOptionAlternativesUseCase.handle(body);
	}

	// @Put('/:id')
	// @ApiOperation({
	// 	summary: 'Actualizar opción de color',
	// 	description:
	// 		'Actualiza los datos de una opción de color existente (nombre, código hexadecimal, etc.)',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la opción de color',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Opción de color actualizada exitosamente',
	// 	type: ColorOptionAlternative,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Opción de color no encontrada',
	// })
	// async updateColorOptionAlternative(
	// 	@Param('id') id: string,
	// 	@Body() body: CreateColorOptionAlternativeDto,
	// ): Promise<ColorOptionAlternative> {
	// 	return this.updateColorOptionAlternativeUseCase.handle(id, body);
	// }

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Listar todas las opciones de color',
		description:
			'Retorna todas las opciones de color disponibles para productos textiles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de opciones de color',
		type: [ColorOptionAlternative],
	})
	async getAllColorOptionAlternatives(): Promise<ColorOptionAlternative[]> {
		return this.getAllColorOptionAlternativesUseCase.handle();
	}

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener opción de color por ID',
	// 	description: 'Retorna una opción de color específica por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la opción de color',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Opción de color encontrada',
	// 	type: ColorOptionAlternative,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Opción de color no encontrada',
	// })
	// async getByIdColorOptionAlternative(
	// 	@Param('id') id: string,
	// ): Promise<ColorOptionAlternative> {
	// 	return this.getByIdColorOptionAlternativeUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar opción de color',
	// 	description: 'Elimina una opción de color por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la opción de color a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Opción de color eliminada exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Opción de color no encontrada',
	// })
	// async deleteColorOptionAlternative(@Param('id') id: string): Promise<void> {
	// 	return this.deleteColorOptionAlternativeUseCase.handle(id);
	// }
}
