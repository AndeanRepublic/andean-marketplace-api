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
import { CreateSuperfoodCertificationDto } from '../dto/superfoods/CreateSuperfoodCertificationDto';
import { SuperfoodCertificationResponse } from '../../../app/modules/SuperfoodCertificationResponse';
import { CreateSuperfoodCertificationUseCase } from '../../../app/use_cases/superfoods/certification/CreateSuperfoodCertificationUseCase';
import { GetSuperfoodCertificationByIdUseCase } from '../../../app/use_cases/superfoods/certification/GetSuperfoodCertificationByIdUseCase';
import { ListSuperfoodCertificationsUseCase } from '../../../app/use_cases/superfoods/certification/ListSuperfoodCertificationsUseCase';
import { DeleteSuperfoodCertificationUseCase } from '../../../app/use_cases/superfoods/certification/DeleteSuperfoodCertificationUseCase';

@ApiTags('Superfood Certifications')
@Controller('superfood-certifications')
export class SuperfoodCertificationController {
	constructor(
		private readonly createSuperfoodCertificationUseCase: CreateSuperfoodCertificationUseCase,
		private readonly getSuperfoodCertificationByIdUseCase: GetSuperfoodCertificationByIdUseCase,
		private readonly listSuperfoodCertificationsUseCase: ListSuperfoodCertificationsUseCase,
		private readonly deleteSuperfoodCertificationUseCase: DeleteSuperfoodCertificationUseCase,
	) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva certificación',
		description: 'Crea una nueva certificación para productos superfood (ej: Orgánico, Fair Trade)',
	})
	@ApiResponse({
		status: 201,
		description: 'Certificación creada exitosamente',
		type: SuperfoodCertificationResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createCertification(
		@Body() dto: CreateSuperfoodCertificationDto,
	): Promise<SuperfoodCertificationResponse> {
		return await this.createSuperfoodCertificationUseCase.handle(dto);
	}

	// @Get()
	// @ApiOperation({
	// 	summary: 'Listar todas las certificaciones',
	// 	description: 'Retorna todas las certificaciones disponibles',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Lista de certificaciones',
	// 	type: [SuperfoodCertificationResponse],
	// })
	// async listCertifications(): Promise<SuperfoodCertificationResponse[]> {
	// 	return await this.listSuperfoodCertificationsUseCase.handle();
	// }

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener certificación por ID',
	// 	description: 'Retorna una certificación específica por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la certificación',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Certificación encontrada',
	// 	type: SuperfoodCertificationResponse,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Certificación no encontrada',
	// })
	// async getCertificationById(
	// 	@Param('id') id: string,
	// ): Promise<SuperfoodCertificationResponse> {
	// 	return await this.getSuperfoodCertificationByIdUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar certificación',
	// 	description: 'Elimina una certificación por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la certificación a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Certificación eliminada exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Certificación no encontrada',
	// })
	// async deleteCertification(@Param('id') id: string): Promise<void> {
	// 	await this.deleteSuperfoodCertificationUseCase.handle(id);
	// }
}
