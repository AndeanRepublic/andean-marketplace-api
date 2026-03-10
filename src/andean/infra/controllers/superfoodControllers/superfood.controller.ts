import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	HttpCode,
	HttpStatus,
	Query,
	ParseIntPipe,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';
import { CreateSuperfoodDto } from '../dto/superfoods/CreateSuperfoodDto';
import { UpdateSuperfoodDto } from '../dto/superfoods/UpdateSuperfoodDto';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { CreateSuperfoodProductUseCase } from '../../../app/use_cases/superfoods/CreateSuperfoodProductUseCase';
import { UpdateSuperfoodProductUseCase } from '../../../app/use_cases/superfoods/UpdateSuperfoodProductUseCase';
import { DeleteSuperfoodProductUseCase } from '../../../app/use_cases/superfoods/DeleteSuperfoodProductUseCase';
import { GetAllSuperfoodProductsUseCase } from '../../../app/use_cases/superfoods/GetAllSuperfoodProductsUseCase';
import { PaginatedProductsResponse } from '../../../app/modules/shared/PaginatedProductsResponse';
import { SuperfoodProductListItem } from '../../../app/modules/superfoods/SuperfoodProductListItem';
import { PaginatedSuperfoodProductsResponse } from '../../../app/modules/superfoods/PaginatedSuperfoodProductsResponse';
import { ProductSortBy } from '../../../domain/enums/ProductSortBy';
import { GetByIdSuperfoodProductDetailUseCase } from '../../../app/use_cases/superfoods/GetByIdSuperfoodProductDetailUseCase';
import { SuperfoodProductDetailResponse } from '../../../app/modules/superfoods/SuperfoodProductDetailResponse';

@ApiTags('Superfoods')
@Controller('superfoods')
export class SuperfoodController {
	constructor(
		private readonly createSuperfoodProductUseCase: CreateSuperfoodProductUseCase,
		private readonly getAllSuperfoodProductsUseCase: GetAllSuperfoodProductsUseCase,
		private readonly updateSuperfoodProductUseCase: UpdateSuperfoodProductUseCase,
		private readonly deleteSuperfoodProductUseCase: DeleteSuperfoodProductUseCase,
		private readonly getByIdSuperfoodProductDetailUseCase: GetByIdSuperfoodProductDetailUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo producto superfood',
		description:
			'Crea un nuevo producto superfood con toda su información nutricional, trazabilidad, opciones y variantes',
	})
	@ApiResponse({
		status: 201,
		description: 'Producto superfood creado exitosamente',
		type: SuperfoodProduct,
	})
	@ApiResponse({
		status: 400,
		description:
			'Datos de entrada inválidos (precio <= 0, stock negativo, variantes duplicadas)',
	})
	@ApiResponse({
		status: 404,
		description: 'Categoría o shop owner no encontrado',
	})
	async createSuperfood(
		@Body() dto: CreateSuperfoodDto,
	): Promise<SuperfoodProduct> {
		return this.createSuperfoodProductUseCase.handle(dto);
	}

	@Get()
	@ApiOperation({
		summary: 'Listar productos superfood con filtros',
		description:
			'Retorna una lista paginada de productos superfood con stock disponible (totalStock > 0). Soporta filtros por rango de precio, categoría y propietario. La respuesta incluye información resumida optimizada para listados.',
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
		description: 'Cantidad de productos por página (por defecto: 10)',
		example: 10,
	})
	@ApiQuery({
		name: 'min_price',
		required: false,
		type: Number,
		description: 'Precio mínimo para filtrar productos (en la moneda base)',
		example: 50,
	})
	@ApiQuery({
		name: 'max_price',
		required: false,
		type: Number,
		description: 'Precio máximo para filtrar productos (en la moneda base)',
		example: 200,
	})
	@ApiQuery({
		name: 'category_id',
		required: false,
		type: String,
		description: 'Filtrar por ID de categoría superfood',
		example: 'category-quinua-001',
	})
	@ApiQuery({
		name: 'owner_id',
		required: false,
		type: String,
		description: 'Filtrar por ID del propietario/vendedor (shop o comunidad)',
		example: 'shop-uuid-1234',
	})
	@ApiQuery({
		name: 'sort_by',
		required: false,
		enum: ProductSortBy,
		description:
			'Criterio de ordenamiento: "latest" (más recientes primero) o "popular" (más comprados primero)',
		example: 'latest',
	})
	@ApiResponse({
		status: 200,
		description:
			'Lista paginada de productos superfood con información resumida',
		type: PaginatedSuperfoodProductsResponse,
	})
	async getAllSuperfoodProducts(
		@Query('page', new ParseIntPipe({ optional: true })) page?: number,
		@Query('per_page', new ParseIntPipe({ optional: true })) perPage?: number,
		@Query('min_price', new ParseIntPipe({ optional: true }))
		minPrice?: number,
		@Query('max_price', new ParseIntPipe({ optional: true }))
		maxPrice?: number,
		@Query('category_id') categoryId?: string,
		@Query('owner_id') ownerId?: string,
		@Query('sort_by') sortBy?: ProductSortBy,
	): Promise<PaginatedProductsResponse<SuperfoodProductListItem>> {
		const filters: any = {};
		if (page !== undefined) filters.page = page;
		if (perPage !== undefined) filters.perPage = perPage;
		if (minPrice !== undefined) filters.minPrice = minPrice;
		if (maxPrice !== undefined) filters.maxPrice = maxPrice;
		if (categoryId) filters.categoryId = categoryId;
		if (ownerId) filters.ownerId = ownerId;
		if (sortBy) filters.sortBy = sortBy;

		return this.getAllSuperfoodProductsUseCase.handle(
			Object.keys(filters).length > 0 ? filters : undefined,
		);
	}

	@Get('/:productId')
	@ApiOperation({
		summary: 'Obtener detalle completo de producto superfood por ID',
		description:
			'Retorna toda la información completa de un producto superfood específico incluyendo imágenes por rol, hero detail, owner, beneficios, información nutricional, trazabilidad, productos similares y reviews',
	})
	@ApiParam({
		name: 'productId',
		description: 'ID único del producto superfood',
		example: '6973d8ffddef7b59c2d4dcfb',
	})
	@ApiResponse({
		status: 200,
		description: 'Detalle completo del producto',
		type: SuperfoodProductDetailResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Producto no encontrado',
	})
	async getSuperfoodById(
		@Param('productId') productId: string,
	): Promise<SuperfoodProductDetailResponse> {
		return this.getByIdSuperfoodProductDetailUseCase.handle(productId);
	}

	@Put('/:productId')
	@ApiOperation({
		summary: 'Actualizar producto superfood',
		description:
			'Actualiza los datos de un producto superfood existente. Solo se actualizan los campos enviados en el body. Los campos no enviados mantienen su valor actual.',
	})
	@ApiParam({
		name: 'productId',
		description: 'ID del producto a actualizar',
		example: 'uuid-1234-5678-90ab-cdef',
	})
	@ApiResponse({
		status: 200,
		description: 'Producto actualizado exitosamente',
		type: SuperfoodProduct,
	})
	@ApiResponse({
		status: 404,
		description: 'Producto no encontrado',
	})
	@ApiResponse({
		status: 400,
		description:
			'Datos de actualización inválidos (precio <= 0, stock negativo, variantes duplicadas)',
	})
	async updateSuperfood(
		@Param('productId') productId: string,
		@Body() dto: CreateSuperfoodDto,
	): Promise<SuperfoodProduct> {
		return this.updateSuperfoodProductUseCase.handle(productId, dto);
	}

	@Delete('/:productId')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar producto superfood',
		description:
			'Elimina permanentemente un producto superfood del sistema. Esta acción no se puede deshacer.',
	})
	@ApiParam({
		name: 'productId',
		description: 'ID del producto a eliminar',
		example: 'uuid-1234-5678-90ab-cdef',
	})
	@ApiResponse({
		status: 204,
		description:
			'Producto eliminado exitosamente (sin contenido en la respuesta)',
	})
	@ApiResponse({
		status: 404,
		description: 'Producto no encontrado',
	})
	async deleteSuperfood(@Param('productId') productId: string): Promise<void> {
		return this.deleteSuperfoodProductUseCase.handle(productId);
	}
}
