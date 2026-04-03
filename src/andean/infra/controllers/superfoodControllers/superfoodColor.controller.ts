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
import { CreateSuperfoodColorDto } from '../dto/superfoods/CreateSuperfoodColorDto';
import { CreateManySuperfoodColorsDto } from '../dto/superfoods/CreateManySuperfoodColorsDto';
import { SuperfoodColorResponse } from '../../../app/models/superfoods/SuperfoodColorResponse';
import { CreateSuperfoodColorUseCase } from '../../../app/use_cases/superfoods/color/CreateSuperfoodColorUseCase';
import { CreateManySuperfoodColorsUseCase } from '../../../app/use_cases/superfoods/color/CreateManySuperfoodColorsUseCase';
import { ListSuperfoodColorsUseCase } from '../../../app/use_cases/superfoods/color/ListSuperfoodColorsUseCase';
import { GetSuperfoodColorByIdUseCase } from '../../../app/use_cases/superfoods/color/GetSuperfoodColorByIdUseCase';
import { DeleteSuperfoodColorUseCase } from '../../../app/use_cases/superfoods/color/DeleteSuperfoodColorUseCase';

@ApiTags('Superfood Colors')
@Controller('superfood-colors')
export class SuperfoodColorController {
	constructor(
		private readonly createSuperfoodColorUseCase: CreateSuperfoodColorUseCase,
		private readonly createManySuperfoodColorsUseCase: CreateManySuperfoodColorsUseCase,
		private readonly listSuperfoodColorsUseCase: ListSuperfoodColorsUseCase,
		private readonly getSuperfoodColorByIdUseCase: GetSuperfoodColorByIdUseCase,
		private readonly deleteSuperfoodColorUseCase: DeleteSuperfoodColorUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples colores superfood',
		description: 'Carga inicial de colores (nombre + hex).',
	})
	@ApiResponse({ status: 201, type: [SuperfoodColorResponse] })
	async createMany(
		@Body() dto: CreateManySuperfoodColorsDto,
	): Promise<SuperfoodColorResponse[]> {
		return await this.createManySuperfoodColorsUseCase.handle(dto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Crear color superfood' })
	@ApiResponse({ status: 201, type: SuperfoodColorResponse })
	async create(
		@Body() dto: CreateSuperfoodColorDto,
	): Promise<SuperfoodColorResponse> {
		return await this.createSuperfoodColorUseCase.handle(dto);
	}

	@Public()
	@Get()
	@ApiOperation({ summary: 'Listar colores superfood' })
	@ApiResponse({ status: 200, type: [SuperfoodColorResponse] })
	async list(): Promise<SuperfoodColorResponse[]> {
		return await this.listSuperfoodColorsUseCase.handle();
	}

	@Public()
	@Get('/:id')
	@ApiOperation({ summary: 'Obtener color por ID' })
	@ApiParam({ name: 'id', description: 'ID del color' })
	@ApiResponse({ status: 200, type: SuperfoodColorResponse })
	@ApiResponse({ status: 404, description: 'No encontrado' })
	async getById(@Param('id') id: string): Promise<SuperfoodColorResponse> {
		return await this.getSuperfoodColorByIdUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Eliminar color superfood' })
	@ApiParam({ name: 'id', description: 'ID del color' })
	@ApiResponse({ status: 204, description: 'Eliminado' })
	@ApiResponse({ status: 404, description: 'No encontrado' })
	async delete(@Param('id') id: string): Promise<void> {
		await this.deleteSuperfoodColorUseCase.handle(id);
	}
}
