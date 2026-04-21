import {
	Body,
	Controller,
	DefaultValuePipe,
	Post,
	Get,
	Patch,
	Param,
	Put,
	Delete,
	Query,
	ParseIntPipe,
	HttpCode,
	HttpStatus,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../core/jwtAuth.guard';
import { RolesGuard } from '../../core/roles.guard';
import { Roles } from '../../core/roles.decorator';
import { CurrentUser } from '../../core/current-user.decorator';
import { AccountRole } from '../../../domain/enums/AccountRole';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';
import { Public } from '../../core/public.decorator';
import { CreateTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileProductUseCase';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { CreateTextileProductDto } from '../dto/textileProducts/CreateTextileProductDto';
import { UpdateTextileProductDto } from '../dto/textileProducts/UpdateTextileProductDto';
import { UpdateTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileProductUseCase';
import { GetAllTextileProductsUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileProductsUseCase';
import { GetAllTextileProductsForManagementUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileProductsForManagementUseCase';
import { GetTextileProductForSellerUseCase } from 'src/andean/app/use_cases/textileProducts/GetTextileProductForSellerUseCase';
import { DeleteTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileProductUseCase';
import {
	PaginatedProductsResponse,
	PaginatedTextileProductsResponse,
} from 'src/andean/app/models/shared/PaginatedProductsResponse';
import { TextileProductListItem } from 'src/andean/app/models/textile/TextileProductListItemResponse';
import { TextileProductDetailResponse } from 'src/andean/app/models/textile/TextileProductDetailResponse';
import { GetByIdTextileProductDetailUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileProductDetailUseCase';
import { ProductSortBy } from 'src/andean/domain/enums/ProductSortBy';
import { UpdateTextileProductStatusUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileProductStatusUseCase';
import { UpdateTextileProductStatusDto } from '../dto/textileProducts/UpdateTextileProductStatusDto';

@ApiTags('Textile Products')
@Controller('textile-products')
export class TextileProductController {
	constructor(
		private readonly createTextileProductUseCase: CreateTextileProductUseCase,
		private readonly updateTextileProductUseCase: UpdateTextileProductUseCase,
		private readonly getAllTextileProductsUseCase: GetAllTextileProductsUseCase,
		private readonly getAllTextileProductsForManagementUseCase: GetAllTextileProductsForManagementUseCase,
		private readonly getTextileProductForSellerUseCase: GetTextileProductForSellerUseCase,
		private readonly deleteTextileProductUseCase: DeleteTextileProductUseCase,
		private readonly getByIdTextileProductDetailUseCase: GetByIdTextileProductDetailUseCase,
		private readonly updateTextileProductStatusUseCase: UpdateTextileProductStatusUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo producto textil',
		description:
			'Crea un nuevo producto textil con toda su información incluyendo variantes, colores, tallas, técnicas de elaboración y certificaciones',
	})
	@ApiResponse({
		status: 201,
		description: 'Producto textil creado exitosamente',
		type: TextileProduct,
	})
	@ApiResponse({
		status: 400,
		description:
			'Datos de entrada inválidos (precio <= 0, stock negativo, variantes duplicadas)',
	})
	@ApiResponse({
		status: 404,
		description: 'Categoría, owner o referencia no encontrada',
	})
	async createTextileProduct(
		@Body() body: CreateTextileProductDto,
	): Promise<TextileProduct> {
		return this.createTextileProductUseCase.handle(body);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Put('/:id')
	@ApiOperation({
		summary: 'Actualizar producto textil',
		description:
			'Actualiza los datos de un producto textil existente. Solo se actualizan los campos enviados en el body.',
	})
	@ApiParam({
		name: 'id',
		description: 'ID único del producto textil',
		example: 'uuid-1234-5678-90ab-cdef',
	})
	@ApiResponse({
		status: 200,
		description: 'Producto actualizado exitosamente',
		type: TextileProduct,
	})
	@ApiResponse({
		status: 404,
		description: 'Producto no encontrado',
	})
	async updateTextileProduct(
		@Param('id') id: string,
		@Body() body: UpdateTextileProductDto,
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
	): Promise<TextileProduct> {
		return this.updateTextileProductUseCase.handle(
			id,
			body,
			requestingUser.userId,
			requestingUser.roles,
		);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Listar productos textiles con filtros',
		description:
			'Retorna una lista paginada de productos textiles con stock disponible (totalStock > 0). Soporta filtros por color, talla, rango de precio, categoría y propietario. La respuesta incluye información resumida optimizada para listados.',
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
		name: 'color',
		required: false,
		type: String,
		description:
			'Filtrar por nombre del color (case-insensitive). Solo retorna productos que tengan variantes con este color.',
		example: 'rojo',
	})
	@ApiQuery({
		name: 'size',
		required: false,
		type: String,
		description:
			'Filtrar por nombre de la talla (case-insensitive). Solo retorna productos que tengan variantes con esta talla.',
		example: 'M',
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
		description: 'Filtrar por ID de categoría textil',
		example: 'category-ponchos-001',
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
	@ApiQuery({
		name: 'include_zero_stock',
		required: false,
		type: Boolean,
		description:
			'Si es true, incluye productos sin stock (totalStock = 0). Por defecto solo hay stock > 0.',
		example: false,
	})
	@ApiResponse({
		status: 200,
		description:
			'Lista paginada de productos textiles con información resumida',
		type: PaginatedTextileProductsResponse,
	})
	async getAllTextileProducts(
		@Query('page', new ParseIntPipe({ optional: true })) page?: number,
		@Query('per_page', new ParseIntPipe({ optional: true })) perPage?: number,
		@Query('color') color?: string,
		@Query('size') size?: string,
		@Query('min_price', new ParseIntPipe({ optional: true })) minPrice?: number,
		@Query('max_price', new ParseIntPipe({ optional: true })) maxPrice?: number,
		@Query('category_id') categoryId?: string,
		@Query('owner_id') ownerId?: string,
		@Query('sort_by') sortBy?: ProductSortBy,
	): Promise<PaginatedProductsResponse<TextileProductListItem>> {
		const filters: any = {};
		if (page !== undefined) filters.page = page;
		if (perPage !== undefined) filters.perPage = perPage;
		if (color) filters.color = color;
		if (size) filters.size = size;
		if (minPrice !== undefined) filters.minPrice = minPrice;
		if (maxPrice !== undefined) filters.maxPrice = maxPrice;
		if (categoryId) filters.categoryId = categoryId;
		if (ownerId) filters.ownerId = ownerId;
		if (sortBy) filters.sortBy = sortBy;

		return this.getAllTextileProductsUseCase.handle(
			Object.keys(filters).length > 0 ? filters : undefined,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Get('management')
	@ApiOperation({
		summary: 'Listar textiles para dashboard (admin)',
		description:
			'Lista paginada con stock 0 incluido y cualquier estado. Para el catálogo público usar GET /textile-products.',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'Número de página (por defecto: 1)',
		example: 1,
	})
	@ApiQuery({
		name: 'per_page',
		required: false,
		type: Number,
		description: 'Items por página (por defecto: 10)',
		example: 10,
	})
	@ApiResponse({
		status: 200,
		description: 'Lista paginada para gestión',
		type: PaginatedTextileProductsResponse,
	})
	async getAllTextileProductsForManagement(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('per_page', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
	): Promise<PaginatedProductsResponse<TextileProductListItem>> {
		return this.getAllTextileProductsForManagementUseCase.handle(
			page,
			perPage,
		);
	}

	// @Get('/:id')
	// async getByIdTextileProduct(
	// 	@Param('id') id: string,
	// ): Promise<TextileProduct> {
	// 	return this.getByIdTextileProductUseCase.handle(id);
	// }

	@Public()
	@Get('/:id/details')
	@ApiOperation({
		summary: 'Obtener producto textil por ID',
		description:
			'Retorna toda la información completa de un producto textil específico incluyendo variantes, colores, tallas, técnicas de elaboración y certificaciones',
	})
	@ApiParam({
		name: 'id',
		description: 'ID único del producto textil',
		example: '6973d8ffddef7b59c2d4dcfb',
	})
	@ApiResponse({
		status: 200,
		description: 'Producto encontrado',
		type: TextileProductDetailResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Producto no encontrado',
	})
	async getTextileProductDetail(
		@Param('id') id: string,
	): Promise<TextileProductDetailResponse> {
		return this.getByIdTextileProductDetailUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener producto textil (admin / edición)',
		description:
			'Devuelve la entidad completa del producto para cargar formularios de edición. Misma regla de acceso que PUT/DELETE.',
	})
	@ApiParam({
		name: 'id',
		description: 'ID único del producto textil',
		example: '6973d8ffddef7b59c2d4dcfb',
	})
	@ApiResponse({
		status: 200,
		description: 'Producto encontrado',
		type: TextileProduct,
	})
	@ApiResponse({ status: 403, description: 'Sin permiso sobre este producto' })
	@ApiResponse({ status: 404, description: 'Producto no encontrado' })
	async getTextileProductForSeller(
		@Param('id') id: string,
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
	): Promise<TextileProduct> {
		return this.getTextileProductForSellerUseCase.handle(
			id,
			requestingUser.userId,
			requestingUser.roles,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Patch('/:id/status')
	async updateTextileProductStatus(
		@Param('id') id: string,
		@Body() body: UpdateTextileProductStatusDto,
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
	): Promise<TextileProduct> {
		return this.updateTextileProductStatusUseCase.handle(
			id,
			body.status,
			requestingUser.userId,
			requestingUser.roles,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar producto textil',
		description: 'Elimina un producto textil por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID del producto a eliminar',
		example: 'uuid-1234-5678-90ab-cdef',
	})
	@ApiResponse({
		status: 204,
		description: 'Producto eliminado exitosamente',
	})
	@ApiResponse({
		status: 404,
		description: 'Producto no encontrado',
	})
	async deleteTextileProduct(
		@Param('id') id: string,
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
	): Promise<void> {
		return this.deleteTextileProductUseCase.handle(
			id,
			requestingUser.userId,
			requestingUser.roles,
		);
	}
}
