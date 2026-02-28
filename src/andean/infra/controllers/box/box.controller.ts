import {
	Body,
	Controller,
	DefaultValuePipe,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateBoxUseCase } from '../../../app/use_cases/boxes/CreateBoxUseCase';
import { GetAllBoxesUseCase } from '../../../app/use_cases/boxes/GetAllBoxesUseCase';
import { GetBoxDetailUseCase } from '../../../app/use_cases/boxes/GetBoxDetailUseCase';
import { Box } from '../../../domain/entities/box/Box';
import { CreateBoxDto } from '../dto/box/CreateBoxDto';
import { BoxListPaginatedResponse } from '../../../app/models/box/BoxListResponse';
import { BoxDetailResponse } from '../../../app/models/box/BoxDetailResponse';

@Controller('boxes')
export class BoxController {
	constructor(
		private readonly createBoxUseCase: CreateBoxUseCase,
		private readonly getAllBoxesUseCase: GetAllBoxesUseCase,
		private readonly getBoxDetailUseCase: GetBoxDetailUseCase,
	) {}

	@Post('')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo box',
		description:
			'Crea un nuevo box con productos (superfoods y/o variantes textiles). Valida que los productos y variantes existan y tengan stock disponible antes de crear el box.',
	})
	@ApiResponse({
		status: 201,
		description: 'Box creado exitosamente',
		type: Box,
	})
	@ApiResponse({
		status: 400,
		description:
			'Datos de entrada inválidos, producto/variante no encontrado o sin stock disponible (VARIANT_NOT_FOUND, VARIANT_OUT_OF_STOCK, PRODUCT_NOT_FOUND, PRODUCT_OUT_OF_STOCK)',
	})
	async createBox(@Body() createBoxDto: CreateBoxDto): Promise<Box> {
		return this.createBoxUseCase.handle(createBoxDto);
	}

	@Get('')
	@ApiOperation({
		summary: 'Listar boxes paginados',
		description:
			'Retorna una lista paginada de todos los boxes disponibles con información resumida.',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'Número de página para paginación (por defecto: 1)',
		example: 1,
	})
	@ApiQuery({
		name: 'per_page',
		required: false,
		type: Number,
		description: 'Cantidad de boxes por página (por defecto: 10)',
		example: 10,
	})
	@ApiResponse({
		status: 200,
		description: 'Lista paginada de boxes',
		type: BoxListPaginatedResponse,
	})
	async getAllBoxes(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('per_page', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
	): Promise<BoxListPaginatedResponse> {
		return this.getAllBoxesUseCase.handle(page, perPage);
	}

	@Get('/:boxId')
	@ApiOperation({
		summary: 'Obtener detalle de un box',
		description:
			'Retorna la información completa de un box específico incluyendo sus productos resueltos (superfoods y textiles).',
	})
	@ApiParam({
		name: 'boxId',
		description: 'ID único del box',
		example: '6973d8ffddef7b59c2d4dcfb',
	})
	@ApiResponse({
		status: 200,
		description: 'Detalle del box encontrado',
		type: BoxDetailResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Box no encontrado',
	})
	async getBoxDetail(
		@Param('boxId') boxId: string,
	): Promise<BoxDetailResponse> {
		return this.getBoxDetailUseCase.handle(boxId);
	}
}
