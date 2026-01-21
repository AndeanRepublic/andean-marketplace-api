import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateSuperfoodDto } from '../dto/superfoods/CreateSuperfoodDto';
import { UpdateSuperfoodDto } from '../dto/superfoods/UpdateSuperfoodDto';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { CreateSuperfoodProductUseCase } from '../../../app/use_cases/superfoods/CreateSuperfoodProductUseCase';
import { GetSuperfoodProductByIdUseCase } from '../../../app/use_cases/superfoods/GetSuperfoodProductByIdUseCase';
import { GetSuperfoodProductsByOwnerUseCase } from '../../../app/use_cases/superfoods/GetSuperfoodProductsByOwnerUseCase';
import { GetSuperfoodProductsByCategoryUseCase } from '../../../app/use_cases/superfoods/GetSuperfoodProductsByCategoryUseCase';
import { UpdateSuperfoodProductUseCase } from '../../../app/use_cases/superfoods/UpdateSuperfoodProductUseCase';
import { DeleteSuperfoodProductUseCase } from '../../../app/use_cases/superfoods/DeleteSuperfoodProductUseCase';

@ApiTags('Superfoods')
@Controller('superfoods')
export class SuperfoodController {
	constructor(
		private readonly createSuperfoodProductUseCase: CreateSuperfoodProductUseCase,
		private readonly getSuperfoodProductByIdUseCase: GetSuperfoodProductByIdUseCase,
		private readonly getSuperfoodProductsByOwnerUseCase: GetSuperfoodProductsByOwnerUseCase,
		private readonly getSuperfoodProductsByCategoryUseCase: GetSuperfoodProductsByCategoryUseCase,
		private readonly updateSuperfoodProductUseCase: UpdateSuperfoodProductUseCase,
		private readonly deleteSuperfoodProductUseCase: DeleteSuperfoodProductUseCase,
	) { }

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

	@Get('/:productId')
	@ApiOperation({
		summary: 'Obtener producto superfood por ID',
		description:
			'Retorna toda la información completa de un producto superfood específico incluyendo información base, precios, inventario, detalles nutricionales, trazabilidad, opciones y variantes',
	})
	@ApiParam({
		name: 'productId',
		description: 'ID único del producto superfood',
		example: 'uuid-1234-5678-90ab-cdef',
	})
	@ApiResponse({
		status: 200,
		description: 'Producto encontrado',
		type: SuperfoodProduct,
	})
	@ApiResponse({
		status: 404,
		description: 'Producto no encontrado',
	})
	async getSuperfoodById(
		@Param('productId') productId: string,
	): Promise<SuperfoodProduct> {
		return this.getSuperfoodProductByIdUseCase.handle(productId);
	}

	@Get('/owner/:ownerId')
	@ApiOperation({
		summary: 'Obtener productos superfood por owner',
		description:
			'Retorna todos los productos de un shop o comunidad específica. Útil para listar el catálogo de un vendedor.',
	})
	@ApiParam({
		name: 'ownerId',
		description: 'ID del shop o comunidad propietaria de los productos',
		example: 'shop-uuid-1234',
	})
	@ApiResponse({
		status: 200,
		description:
			'Lista de productos del owner (puede ser array vacío si no tiene productos)',
		type: [SuperfoodProduct],
	})
	async getSuperfoodsByOwner(
		@Param('ownerId') ownerId: string,
	): Promise<SuperfoodProduct[]> {
		return this.getSuperfoodProductsByOwnerUseCase.handle(ownerId);
	}

	@Get('/category/:categoryId')
	@ApiOperation({
		summary: 'Obtener productos superfood por categoría',
		description:
			'Retorna todos los productos de una categoría específica (ej: Quinua, Maca, Cacao). Útil para filtros de navegación y catálogos por categoría.',
	})
	@ApiParam({
		name: 'categoryId',
		description: 'ID de la categoría de superfood',
		example: 'category-quinua-001',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de productos de la categoría',
		type: [SuperfoodProduct],
	})
	@ApiResponse({
		status: 404,
		description: 'Categoría no encontrada',
	})
	async getSuperfoodsByCategory(
		@Param('categoryId') categoryId: string,
	): Promise<SuperfoodProduct[]> {
		return this.getSuperfoodProductsByCategoryUseCase.handle(categoryId);
	}

	@Patch('/:productId')
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
