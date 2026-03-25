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
import { CreateSuperfoodBenefitDto } from '../dto/superfoods/CreateSuperfoodBenefitDto';
import { CreateManySuperfoodBenefitsDto } from '../dto/superfoods/CreateManySuperfoodBenefitsDto';
import { SuperfoodBenefitResponse } from '../../../app/models/superfoods/SuperfoodBenefitResponse';
import { CreateSuperfoodBenefitUseCase } from '../../../app/use_cases/superfoods/benefit/CreateSuperfoodBenefitUseCase';
import { CreateManySuperfoodBenefitsUseCase } from '../../../app/use_cases/superfoods/benefit/CreateManySuperfoodBenefitsUseCase';
import { GetSuperfoodBenefitByIdUseCase } from '../../../app/use_cases/superfoods/benefit/GetSuperfoodBenefitByIdUseCase';
import { ListSuperfoodBenefitsUseCase } from '../../../app/use_cases/superfoods/benefit/ListSuperfoodBenefitsUseCase';
import { DeleteSuperfoodBenefitUseCase } from '../../../app/use_cases/superfoods/benefit/DeleteSuperfoodBenefitUseCase';

@ApiTags('Superfood Benefits')
@Controller('superfood-benefits')
export class SuperfoodBenefitController {
	constructor(
		private readonly createSuperfoodBenefitUseCase: CreateSuperfoodBenefitUseCase,
		private readonly createManySuperfoodBenefitsUseCase: CreateManySuperfoodBenefitsUseCase,
		private readonly getSuperfoodBenefitByIdUseCase: GetSuperfoodBenefitByIdUseCase,
		private readonly listSuperfoodBenefitsUseCase: ListSuperfoodBenefitsUseCase,
		private readonly deleteSuperfoodBenefitUseCase: DeleteSuperfoodBenefitUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples beneficios',
		description:
			'Crea múltiples beneficios de superfood en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiResponse({
		status: 201,
		description: 'Beneficios creados exitosamente',
		type: [SuperfoodBenefitResponse],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManyBenefits(
		@Body() dto: CreateManySuperfoodBenefitsDto,
	): Promise<SuperfoodBenefitResponse[]> {
		return await this.createManySuperfoodBenefitsUseCase.handle(dto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo beneficio',
		description:
			'Crea un nuevo beneficio de superfood (ej: Mejora la digestión, Aumenta energía)',
	})
	@ApiResponse({
		status: 201,
		description: 'Beneficio creado exitosamente',
		type: SuperfoodBenefitResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createBenefit(
		@Body() dto: CreateSuperfoodBenefitDto,
	): Promise<SuperfoodBenefitResponse> {
		return await this.createSuperfoodBenefitUseCase.handle(dto);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Listar todos los beneficios',
		description: 'Retorna todos los beneficios disponibles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de beneficios',
		type: [SuperfoodBenefitResponse],
	})
	async listBenefits(): Promise<SuperfoodBenefitResponse[]> {
		return await this.listSuperfoodBenefitsUseCase.handle();
	}

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener beneficio por ID',
	// 	description: 'Retorna un beneficio específico por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del beneficio',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Beneficio encontrado',
	// 	type: SuperfoodBenefitResponse,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Beneficio no encontrado',
	// })
	// async getBenefitById(
	// 	@Param('id') id: string,
	// ): Promise<SuperfoodBenefitResponse> {
	// 	return await this.getSuperfoodBenefitByIdUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar beneficio',
	// 	description: 'Elimina un beneficio por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID del beneficio a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Beneficio eliminado exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Beneficio no encontrado',
	// })
	// async deleteBenefit(@Param('id') id: string): Promise<void> {
	// 	await this.deleteSuperfoodBenefitUseCase.handle(id);
	// }
}
