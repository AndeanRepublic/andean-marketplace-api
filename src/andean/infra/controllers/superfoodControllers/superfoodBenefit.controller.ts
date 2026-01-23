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
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
} from '@nestjs/swagger';
import { CreateSuperfoodBenefitDto } from '../dto/superfoods/CreateSuperfoodBenefitDto';
import { SuperfoodBenefitResponse } from '../../../app/modules/SuperfoodBenefitResponse';
import { CreateSuperfoodBenefitUseCase } from '../../../app/use_cases/superfoods/benefit/CreateSuperfoodBenefitUseCase';
import { GetSuperfoodBenefitByIdUseCase } from '../../../app/use_cases/superfoods/benefit/GetSuperfoodBenefitByIdUseCase';
import { ListSuperfoodBenefitsUseCase } from '../../../app/use_cases/superfoods/benefit/ListSuperfoodBenefitsUseCase';
import { DeleteSuperfoodBenefitUseCase } from '../../../app/use_cases/superfoods/benefit/DeleteSuperfoodBenefitUseCase';

@ApiTags('Superfood Benefits')
@Controller('superfood-benefits')
export class SuperfoodBenefitController {
	constructor(
		private readonly createSuperfoodBenefitUseCase: CreateSuperfoodBenefitUseCase,
		private readonly getSuperfoodBenefitByIdUseCase: GetSuperfoodBenefitByIdUseCase,
		private readonly listSuperfoodBenefitsUseCase: ListSuperfoodBenefitsUseCase,
		private readonly deleteSuperfoodBenefitUseCase: DeleteSuperfoodBenefitUseCase,
	) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo beneficio',
		description: 'Crea un nuevo beneficio de superfood (ej: Mejora la digestión, Aumenta energía)',
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

	// @Get()
	// @ApiOperation({
	// 	summary: 'Listar todos los beneficios',
	// 	description: 'Retorna todos los beneficios disponibles',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Lista de beneficios',
	// 	type: [SuperfoodBenefitResponse],
	// })
	// async listBenefits(): Promise<SuperfoodBenefitResponse[]> {
	// 	return await this.listSuperfoodBenefitsUseCase.handle();
	// }

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
