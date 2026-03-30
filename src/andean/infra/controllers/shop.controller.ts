import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	HttpCode,
	HttpStatus,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../core/jwtAuth.guard';
import { RolesGuard } from '../core/roles.guard';
import { Roles } from '../core/roles.decorator';
import { AccountRole } from '../../domain/enums/AccountRole';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger';
import { Public } from '../core/public.decorator';
import { GetShopByIdUseCase } from '../../app/use_cases/shops/GetShopByIdUseCase';
import { GetShopsByCategoryUseCase } from '../../app/use_cases/shops/GetShopsByCategoryUseCase';
import { GetShopsBySellerIdUseCase } from '../../app/use_cases/shops/GetShopsBySellerIdUseCase';
import { DeleteShopUseCase } from '../../app/use_cases/shops/DeleteShopUseCase';
import { CreateShopUseCase } from '../../app/use_cases/shops/CreateShopUseCase';
import { ListAllShopsUseCase } from '../../app/use_cases/shops/ListAllShopsUseCase';
import { Shop } from '../../domain/entities/Shop';
import { CreateShopDto } from './dto/CreateShopDto';
import { UpdateShopDto } from './dto/UpdateShopDto';
import { UpdateShopUseCase } from '../../app/use_cases/shops/UpdateShopUseCase';
import { ShopResponse } from '../../app/models/shop/ShopResponse';
import { CurrentUser } from '../core/current-user.decorator';

@ApiTags('shops')
@Controller('shops')
export class ShopController {
	constructor(
		private readonly listAllShopsUseCase: ListAllShopsUseCase,
		private readonly getShopsByIdUseCase: GetShopByIdUseCase,
		private readonly getShopsByCategoryUseCase: GetShopsByCategoryUseCase,
		private readonly getShopsBySellerIdUseCase: GetShopsBySellerIdUseCase,
		private readonly createShopUseCase: CreateShopUseCase,
		private readonly deleteShopUseCase: DeleteShopUseCase,
		private readonly updateShopUseCase: UpdateShopUseCase,
	) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Listar todas las tiendas',
		description:
			'Lista todas las tiendas/emprendimientos (p. ej. para formularios de alta de producto)',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de tiendas',
		type: [ShopResponse],
	})
	async listAll(): Promise<Shop[]> {
		return this.listAllShopsUseCase.handle();
	}

	@Public()
	@Get('by-seller/:sellerId')
	@ApiOperation({
		summary: 'Obtener tiendas por vendedor',
		description: 'Recupera todas las tiendas asociadas a un vendedor',
	})
	@ApiParam({ name: 'sellerId', description: 'ID del vendedor', type: String })
	@ApiResponse({
		status: 200,
		description: 'Lista de tiendas del vendedor',
		type: [ShopResponse],
	})
	@ApiResponse({ status: 404, description: 'Vendedor no encontrado' })
	async finBySeller(@Param('sellerId') sellerId: string): Promise<Shop[]> {
		return this.getShopsBySellerIdUseCase.handle(sellerId);
	}

	@Public()
	@Get('by-category/:categoryName')
	@ApiOperation({
		summary: 'Obtener tiendas por categoría',
		description:
			'Recupera todas las tiendas que pertenecen a una categoría específica',
	})
	@ApiParam({
		name: 'categoryName',
		description: 'Nombre de la categoría',
		type: String,
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de tiendas de la categoría',
		type: [ShopResponse],
	})
	async getByCategory(
		@Param('categoryName') categoryName: string,
	): Promise<Shop[]> {
		return this.getShopsByCategoryUseCase.handle(categoryName);
	}

	@Public()
	@Get(':shopId')
	@ApiOperation({
		summary: 'Obtener tienda por ID',
		description: 'Recupera la información de una tienda específica por su ID',
	})
	@ApiParam({ name: 'shopId', description: 'ID de la tienda', type: String })
	@ApiResponse({
		status: 200,
		description: 'Tienda encontrada',
		type: ShopResponse,
	})
	@ApiResponse({ status: 404, description: 'Tienda no encontrada' })
	async findById(@Param('shopId') shopId: string): Promise<Shop> {
		return this.getShopsByIdUseCase.handle(shopId);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post('')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear una nueva tienda',
		description:
			'Registra una nueva tienda en el marketplace asociada a un vendedor',
	})
	@ApiBody({ type: CreateShopDto })
	@ApiResponse({
		status: 201,
		description: 'Tienda creada exitosamente',
		type: ShopResponse,
	})
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	@ApiResponse({ status: 404, description: 'Vendedor no encontrado' })
	async createShop(@Body() createShopDto: CreateShopDto): Promise<Shop> {
		return this.createShopUseCase.handle(createShopDto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Delete('/:shopId')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar una tienda',
		description: 'Elimina una tienda del marketplace por su ID',
	})
	@ApiParam({ name: 'shopId', description: 'ID de la tienda', type: String })
	@ApiResponse({ status: 204, description: 'Tienda eliminada exitosamente' })
	@ApiResponse({ status: 404, description: 'Tienda no encontrada' })
	async deleteShop(
		@Param('shopId') shopId: string,
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
	): Promise<void> {
		return this.deleteShopUseCase.handle(
			shopId,
			requestingUser.userId,
			requestingUser.roles,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Patch(':shopId')
	@ApiOperation({ summary: 'Actualizar tienda', description: 'Actualiza los datos de una tienda existente' })
	@ApiParam({ name: 'shopId', description: 'ID de la tienda', type: String })
	@ApiResponse({ status: 200, description: 'Tienda actualizada', type: ShopResponse })
	@ApiResponse({ status: 404, description: 'Tienda no encontrada' })
	async updateShop(
		@Param('shopId') shopId: string,
		@Body() dto: UpdateShopDto,
	): Promise<Shop> {
		return this.updateShopUseCase.handle(shopId, dto);
	}
}