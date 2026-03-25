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
import { TextilePrincipalUseResponse } from 'src/andean/app/models/textile/TextilePrincipalUseResponse';
import { CreateTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextilePrincipalUseUseCase';
import { CreateManyTextilePrincipalUsesUseCase } from 'src/andean/app/use_cases/textileProducts/CreateManyTextilePrincipalUsesUseCase';
import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';
import { CreateTextilePrincipalUseDto } from '../dto/textileProducts/CreateTextilePrincipalUseDto';
import { CreateManyTextilePrincipalUsesDto } from '../dto/textileProducts/CreateManyTextilePrincipalUsesDto';
import { UpdateTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextilePrincipalUseUseCase';
import { GetAllTextilePrincipalUsesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextilePrincipalUsesUseCase';
import { GetByIdTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextilePrincipalUseUseCase';
import { DeleteTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextilePrincipalUseUseCase';

@ApiTags('Textile Principal Uses')
@Controller('textile-products/principal-uses')
export class TextilePrincipalUseController {
	constructor(
		private readonly createTextilePrincipalUseUseCase: CreateTextilePrincipalUseUseCase,
		private readonly createManyTextilePrincipalUsesUseCase: CreateManyTextilePrincipalUsesUseCase,
		private readonly updateTextilePrincipalUseUseCase: UpdateTextilePrincipalUseUseCase,
		private readonly getAllTextilePrincipalUsesUseCase: GetAllTextilePrincipalUsesUseCase,
		private readonly getByIdTextilePrincipalUseUseCase: GetByIdTextilePrincipalUseUseCase,
		private readonly deleteTextilePrincipalUseUseCase: DeleteTextilePrincipalUseUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples usos principales',
		description:
			'Crea múltiples usos principales en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiResponse({
		status: 201,
		description: 'Usos principales creados exitosamente',
		type: [TextilePrincipalUse],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManyTextilePrincipalUses(
		@Body() body: CreateManyTextilePrincipalUsesDto,
	): Promise<TextilePrincipalUse[]> {
		return this.createManyTextilePrincipalUsesUseCase.handle(body);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo uso principal',
		description:
			'Crea un nuevo uso principal para productos textiles (ej: Vestimenta ceremonial, Uso diario, Decoración, Uso ritual)',
	})
	@ApiResponse({
		status: 201,
		description: 'Uso principal creado exitosamente',
		type: TextilePrincipalUse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createTextilePrincipalUse(
		@Body() body: CreateTextilePrincipalUseDto,
	): Promise<TextilePrincipalUse> {
		return this.createTextilePrincipalUseUseCase.handle(body);
	}

	// @Put('/:id')
	// @ApiOperation({
	// 	summary: 'Actualizar uso principal',
	// 	description: 'Actualiza los datos de un uso principal existente',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del uso principal',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Uso principal actualizado exitosamente',
	// 	type: TextilePrincipalUse,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Uso principal no encontrado',
	// })
	// async updateTextilePrincipalUse(
	// 	@Param('id') id: string,
	// 	@Body() body: CreateTextilePrincipalUseDto,
	// ): Promise<TextilePrincipalUse> {
	// 	return this.updateTextilePrincipalUseUseCase.handle(id, body);
	// }

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Listar todos los usos principales',
		description:
			'Retorna todos los usos principales disponibles para productos textiles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de usos principales',
		type: [TextilePrincipalUseResponse],
	})
	async getAllTextilePrincipalUses(): Promise<TextilePrincipalUse[]> {
		return this.getAllTextilePrincipalUsesUseCase.handle();
	}

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener uso principal por ID',
	// 	description: 'Retorna un uso principal específico por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del uso principal',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Uso principal encontrado',
	// 	type: TextilePrincipalUse,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Uso principal no encontrado',
	// })
	// async getByIdTextilePrincipalUse(
	// 	@Param('id') id: string,
	// ): Promise<TextilePrincipalUse> {
	// 	return this.getByIdTextilePrincipalUseUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar uso principal',
	// 	description: 'Elimina un uso principal por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del uso principal a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Uso principal eliminado exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Uso principal no encontrado',
	// })
	// async deleteTextilePrincipalUse(@Param('id') id: string): Promise<void> {
	// 	return this.deleteTextilePrincipalUseUseCase.handle(id);
	// }
}
