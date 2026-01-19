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
import { CreateSuperfoodNutritionalFeatureDto } from './dto/superfoods/CreateSuperfoodNutritionalFeatureDto';
import { SuperfoodNutritionalFeatureResponse } from '../../app/modules/SuperfoodNutritionalFeatureResponse';
import { CreateSuperfoodNutritionalFeatureUseCase } from '../../app/use_cases/superfoods/nutritionalFeature/CreateSuperfoodNutritionalFeatureUseCase';
import { GetSuperfoodNutritionalFeatureByIdUseCase } from '../../app/use_cases/superfoods/nutritionalFeature/GetSuperfoodNutritionalFeatureByIdUseCase';
import { ListSuperfoodNutritionalFeaturesUseCase } from '../../app/use_cases/superfoods/nutritionalFeature/ListSuperfoodNutritionalFeaturesUseCase';
import { DeleteSuperfoodNutritionalFeatureUseCase } from '../../app/use_cases/superfoods/nutritionalFeature/DeleteSuperfoodNutritionalFeatureUseCase';

@ApiTags('Superfood Nutritional Features')
@Controller('superfood-nutritional-features')
export class SuperfoodNutritionalFeatureController {
	constructor(
		private readonly createSuperfoodNutritionalFeatureUseCase: CreateSuperfoodNutritionalFeatureUseCase,
		private readonly getSuperfoodNutritionalFeatureByIdUseCase: GetSuperfoodNutritionalFeatureByIdUseCase,
		private readonly listSuperfoodNutritionalFeaturesUseCase: ListSuperfoodNutritionalFeaturesUseCase,
		private readonly deleteSuperfoodNutritionalFeatureUseCase: DeleteSuperfoodNutritionalFeatureUseCase,
	) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva característica nutricional',
		description: 'Crea una nueva característica nutricional (ej: Alto en proteínas, Rico en fibra)',
	})
	@ApiResponse({
		status: 201,
		description: 'Característica creada exitosamente',
		type: SuperfoodNutritionalFeatureResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createNutritionalFeature(
		@Body() dto: CreateSuperfoodNutritionalFeatureDto,
	): Promise<SuperfoodNutritionalFeatureResponse> {
		return await this.createSuperfoodNutritionalFeatureUseCase.handle(dto);
	}

	@Get()
	@ApiOperation({
		summary: 'Listar todas las características nutricionales',
		description: 'Retorna todas las características nutricionales disponibles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de características',
		type: [SuperfoodNutritionalFeatureResponse],
	})
	async listNutritionalFeatures(): Promise<SuperfoodNutritionalFeatureResponse[]> {
		return await this.listSuperfoodNutritionalFeaturesUseCase.handle();
	}

	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener característica por ID',
		description: 'Retorna una característica nutricional específica por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la característica',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 200,
		description: 'Característica encontrada',
		type: SuperfoodNutritionalFeatureResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Característica no encontrada',
	})
	async getNutritionalFeatureById(
		@Param('id') id: string,
	): Promise<SuperfoodNutritionalFeatureResponse> {
		return await this.getSuperfoodNutritionalFeatureByIdUseCase.handle(id);
	}

	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar característica nutricional',
		description: 'Elimina una característica nutricional por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la característica a eliminar',
		example: 'uuid-1234-5678',
	})
	@ApiResponse({
		status: 204,
		description: 'Característica eliminada exitosamente',
	})
	@ApiResponse({
		status: 404,
		description: 'Característica no encontrada',
	})
	async deleteNutritionalFeature(@Param('id') id: string): Promise<void> {
		await this.deleteSuperfoodNutritionalFeatureUseCase.handle(id);
	}
}
