import {
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	Patch,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../core/jwtAuth.guard';
import { RolesGuard } from '../../core/roles.guard';
import { Roles } from '../../core/roles.decorator';
import { AccountRole } from '../../../domain/enums/AccountRole';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiQuery,
	ApiBody,
} from '@nestjs/swagger';
import { Public } from '../../core/public.decorator';
import { CreateBoxUseCase } from '../../../app/use_cases/boxes/CreateBoxUseCase';
import { GetAllBoxesUseCase } from '../../../app/use_cases/boxes/GetAllBoxesUseCase';
import { GetBoxDetailUseCase } from '../../../app/use_cases/boxes/GetBoxDetailUseCase';
import { GetBoxCatalogSuperfoodsUseCase } from '../../../app/use_cases/boxes/GetBoxCatalogSuperfoodsUseCase';
import { GetBoxCatalogTextileProductsUseCase } from '../../../app/use_cases/boxes/GetBoxCatalogTextileProductsUseCase';
import { GetBoxCatalogTextileVariantsUseCase } from '../../../app/use_cases/boxes/GetBoxCatalogTextileVariantsUseCase';
import { GetBoxCatalogTextileProductMediaUseCase } from '../../../app/use_cases/boxes/GetBoxCatalogTextileProductMediaUseCase';
import { GetBoxCatalogSuperfoodProductMediaUseCase } from '../../../app/use_cases/boxes/GetBoxCatalogSuperfoodProductMediaUseCase';
import { Box } from '../../../domain/entities/box/Box';
import { CreateBoxDto } from '../dto/box/CreateBoxDto';
import { BoxListPaginatedResponse } from '../../../app/models/box/BoxListResponse';
import { BoxDetailResponse } from '../../../app/models/box/BoxDetailResponse';
import {
	BoxCatalogSuperfoodsResponseDto,
	BoxCatalogTextilesResponseDto,
	BoxCatalogVariantsResponseDto,
	BoxCatalogMediaResponseDto,
} from '../../../app/models/box/catalog/BoxCatalogResponses';
import { UpdateBoxStatusUseCase } from '../../../app/use_cases/boxes/UpdateBoxStatusUseCase';
import { UpdateEntityStatusDto } from '../dto/UpdateEntityStatusDto';
import { UpdateBoxUseCase } from '../../../app/use_cases/boxes/UpdateBoxUseCase';
import { DeleteBoxUseCase } from '../../../app/use_cases/boxes/DeleteBoxUseCase';
import { GetBoxForAdminEditUseCase } from '../../../app/use_cases/boxes/GetBoxForAdminEditUseCase';

@Controller('boxes')
export class BoxController {
	constructor(
		private readonly createBoxUseCase: CreateBoxUseCase,
		private readonly getAllBoxesUseCase: GetAllBoxesUseCase,
		private readonly getBoxDetailUseCase: GetBoxDetailUseCase,
		private readonly getBoxCatalogSuperfoodsUseCase: GetBoxCatalogSuperfoodsUseCase,
		private readonly getBoxCatalogTextileProductsUseCase: GetBoxCatalogTextileProductsUseCase,
		private readonly getBoxCatalogTextileVariantsUseCase: GetBoxCatalogTextileVariantsUseCase,
		private readonly getBoxCatalogTextileProductMediaUseCase: GetBoxCatalogTextileProductMediaUseCase,
		private readonly getBoxCatalogSuperfoodProductMediaUseCase: GetBoxCatalogSuperfoodProductMediaUseCase,
		private readonly updateBoxStatusUseCase: UpdateBoxStatusUseCase,
		private readonly updateBoxUseCase: UpdateBoxUseCase,
		private readonly deleteBoxUseCase: DeleteBoxUseCase,
		private readonly getBoxForAdminEditUseCase: GetBoxForAdminEditUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
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

	@Public()
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

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Patch(':boxId/status')
	async updateStatus(
		@Param('boxId') boxId: string,
		@Body() dto: UpdateEntityStatusDto,
	): Promise<Box> {
		return this.updateBoxStatusUseCase.handle(boxId, dto.status);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Get('catalog/superfoods')
	@ApiOperation({
		summary: 'Catálogo superfoods para formulario de box (admin)',
		description:
			'Listado completo (sin paginar) con categoría e imagen para el admin. No modifica GET /superfoods público.',
	})
	@ApiResponse({ status: 200, type: BoxCatalogSuperfoodsResponseDto })
	async getCatalogSuperfoods(): Promise<BoxCatalogSuperfoodsResponseDto> {
		return this.getBoxCatalogSuperfoodsUseCase.handle();
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Get('catalog/superfoods/:productId/media')
	@ApiOperation({
		summary: 'Imágenes del superfood para narrativeImgId en box (admin)',
	})
	@ApiParam({ name: 'productId', description: 'ID del producto superfood' })
	@ApiResponse({ status: 200, type: BoxCatalogMediaResponseDto })
	@ApiResponse({ status: 404, description: 'Producto no encontrado' })
	async getCatalogSuperfoodMedia(
		@Param('productId') productId: string,
	): Promise<BoxCatalogMediaResponseDto> {
		return this.getBoxCatalogSuperfoodProductMediaUseCase.handle(productId);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Get('catalog/textile-products')
	@ApiOperation({
		summary: 'Catálogo textiles para formulario de box (admin)',
		description: 'Listado completo (sin paginar) con miniatura para el admin.',
	})
	@ApiResponse({ status: 200, type: BoxCatalogTextilesResponseDto })
	async getCatalogTextileProducts(): Promise<BoxCatalogTextilesResponseDto> {
		return this.getBoxCatalogTextileProductsUseCase.handle();
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Get('catalog/textile-products/:productId/variants')
	@ApiOperation({
		summary: 'Variantes textil con miniatura para formulario de box (admin)',
	})
	@ApiParam({ name: 'productId', description: 'ID del producto textil' })
	@ApiResponse({ status: 200, type: BoxCatalogVariantsResponseDto })
	@ApiResponse({ status: 404, description: 'Producto no encontrado' })
	async getCatalogTextileVariants(
		@Param('productId') productId: string,
	): Promise<BoxCatalogVariantsResponseDto> {
		return this.getBoxCatalogTextileVariantsUseCase.handle(productId);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Get('catalog/textile-products/:productId/media')
	@ApiOperation({
		summary:
			'Imágenes del producto textil (baseInfo.mediaIds) para narrativeImgId en box (admin)',
	})
	@ApiParam({ name: 'productId', description: 'ID del producto textil' })
	@ApiResponse({ status: 200, type: BoxCatalogMediaResponseDto })
	@ApiResponse({ status: 404, description: 'Producto no encontrado' })
	async getCatalogTextileProductMedia(
		@Param('productId') productId: string,
	): Promise<BoxCatalogMediaResponseDto> {
		return this.getBoxCatalogTextileProductMediaUseCase.handle(productId);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Get('admin/:boxId')
	@ApiOperation({
		summary: 'Obtener box para edición (admin)',
		description:
			'Devuelve el agregado persistido (misma forma que creación) para poblar el formulario.',
	})
	@ApiParam({ name: 'boxId', description: 'ID del box' })
	@ApiResponse({ status: 200, type: Box })
	@ApiResponse({ status: 404, description: 'Box no encontrado' })
	async getBoxForAdminEdit(@Param('boxId') boxId: string): Promise<Box> {
		return this.getBoxForAdminEditUseCase.handle(boxId);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Put(':boxId')
	@ApiOperation({
		summary: 'Actualizar box completo',
		description:
			'Reemplaza datos del box conservando id, estado y fecha de creación.',
	})
	@ApiParam({ name: 'boxId', description: 'ID del box' })
	@ApiBody({ type: CreateBoxDto })
	@ApiResponse({ status: 200, type: Box })
	async updateBox(
		@Param('boxId') boxId: string,
		@Body() dto: CreateBoxDto,
	): Promise<Box> {
		return this.updateBoxUseCase.handle(boxId, dto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Delete(':boxId')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Eliminar box' })
	@ApiParam({ name: 'boxId', description: 'ID del box' })
	@ApiResponse({ status: 204, description: 'Eliminado' })
	@ApiResponse({ status: 404, description: 'Box no encontrado' })
	async deleteBox(@Param('boxId') boxId: string): Promise<void> {
		return this.deleteBoxUseCase.handle(boxId);
	}

	@Public()
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
