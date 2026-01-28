import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/products/CreateProductDto';
import { Product } from '../../domain/entities/products/Product';
import { CreateProductUseCase } from '../../app/use_cases/products/CreateProductUseCase';
import { GetProductsBySellerIdUseCase } from '../../app/use_cases/products/GetProductsBySellerIdUseCase';
import { DeleteProductUseCase } from '../../app/use_cases/products/DeleteProductUseCase';
import { GetProductByIdUseCase } from '../../app/use_cases/products/GetProductByIdUseCase';
import { GetProductsByShopUseCase } from '../../app/use_cases/products/GetProductsByShopUseCase';
import { CreateVariantUseCase } from '../../app/use_cases/products/CreateVariantUseCase';
import { CreateVariantDto } from './dto/products/CreateVariantDto';
import { ProductVariant } from '../../domain/entities/products/ProductVariant';

@ApiTags('products')
@Controller('products')
export class ProductController {
	constructor(
		private readonly createProductUseCase: CreateProductUseCase,
		private readonly getProductsBySellerIdUseCase: GetProductsBySellerIdUseCase,
		private readonly getProductsByShopUseCase: GetProductsByShopUseCase,
		private readonly getProductByIdUseCase: GetProductByIdUseCase,
		private readonly deleteProductByIdUseCase: DeleteProductUseCase,
		private readonly createVariantUseCase: CreateVariantUseCase,
	) {}

	@Post('')
	@ApiOperation({
		summary: 'Crear un nuevo producto',
		description:
			'Crea un producto en el marketplace. Nota: Esta entidad migrará a 3 entidades separadas en el futuro.',
	})
	@ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	async createProduct(@Body() body: CreateProductDto): Promise<Product> {
		return this.createProductUseCase.handle(body);
	}

	@Post('/:productId/variants')
	async createVariant(
		@Param('productId') productId: string,
		@Body() body: CreateVariantDto,
	): Promise<ProductVariant> {
		return this.createVariantUseCase.handle(body, productId);
	}

	@Get('/by-seller/:sellerId')
	async getBySellerId(
		@Param('sellerId') sellerId: string,
	): Promise<Product[]> {
		return this.getProductsBySellerIdUseCase.handle(sellerId);
	}

	@Get('/by-shop/:shopId')
	async getByShop(@Param('shopId') shopId: string): Promise<Product[]> {
		return this.getProductsByShopUseCase.handle(shopId);
	}

	@Get('/:productId')
	@ApiOperation({ summary: 'Obtener producto por ID' })
	@ApiParam({ name: 'productId', description: 'ID del producto' })
	@ApiResponse({ status: 200, description: 'Producto encontrado' })
	@ApiResponse({ status: 404, description: 'Producto no encontrado' })
	async getById(@Param('productId') productId: string): Promise<Product> {
		return this.getProductByIdUseCase.handle(productId);
	}

	@Delete('/:productId')
	async deleteProduct(@Param('productId') productId: string): Promise<void> {
		return this.deleteProductByIdUseCase.handle(productId);
	}
}
