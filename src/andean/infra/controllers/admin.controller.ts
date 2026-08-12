import {

	Body,

	Controller,

	Get,

	HttpCode,

	HttpStatus,

	Param,

	Patch,

	Post,

	Put,

	Query,

	UseGuards,

} from '@nestjs/common';

import {

	ApiTags,

	ApiOperation,

	ApiResponse,

	ApiBearerAuth,

	ApiParam,

	ApiBody,

	ApiQuery,

} from '@nestjs/swagger';

import { GetAllSellersUseCase } from '../../app/use_cases/users/GetAllSellersUseCase';

import { UpdateAccountStatusUseCase } from '../../app/use_cases/users/UpdateAccountStatusUseCase';

import { ReviewSellerApplicationUseCase } from '../../app/use_cases/users/ReviewSellerApplicationUseCase';

import { CreateAdminSellerUseCase } from '../../app/use_cases/users/CreateAdminSellerUseCase';
import { LookupAccountByEmailUseCase } from '../../app/use_cases/users/LookupAccountByEmailUseCase';
import { CreateAdminSellerByEmailUseCase } from '../../app/use_cases/users/CreateAdminSellerByEmailUseCase';
import { CreateAdminSellerWithAccountUseCase } from '../../app/use_cases/users/CreateAdminSellerWithAccountUseCase';

import { ListPendingSellerApplicationsUseCase } from '../../app/use_cases/users/ListPendingSellerApplicationsUseCase';

import { GetSellerApplicationDetailUseCase } from '../../app/use_cases/users/GetSellerApplicationDetailUseCase';

import { LinkShopToSellerUseCase } from '../../app/use_cases/shop/LinkShopToSellerUseCase';
import { UnlinkShopFromSellerUseCase } from '../../app/use_cases/shop/UnlinkShopFromSellerUseCase';
import { ListAvailableSellersUseCase } from '../../app/use_cases/shop/ListAvailableSellersUseCase';
import { ListAvailableShopsUseCase } from '../../app/use_cases/shop/ListAvailableShopsUseCase';

import { ListShopsForAdminUseCase } from '../../app/use_cases/shop/ListShopsForAdminUseCase';

import { UpdateAccountStatusDto } from './dto/UpdateAccountStatusDto';

import { ReviewSellerApplicationDto } from './dto/ReviewSellerApplicationDto';

import { CreateSellerDto } from './dto/CreateSellerDto';
import { CreateAdminSellerByEmailDto } from './dto/admin/CreateAdminSellerByEmailDto';
import { CreateAdminSellerWithAccountDto } from './dto/admin/CreateAdminSellerWithAccountDto';
import { AdminAccountLookupResponse } from '../../app/models/users/AdminAccountLookupResponse';

import { LinkShopToSellerDto } from './dto/LinkShopToSellerDto';

import { ReviewSellerApplicationResponse } from '../../app/models/shop/ReviewSellerApplicationResponse';

import { LinkShopToSellerResponse } from '../../app/models/shop/LinkShopToSellerResponse';

import { SellerApplicationListItemResponse } from '../../app/models/shop/SellerApplicationListItemResponse';

import { SellerApplicationDetailResponse } from '../../app/models/shop/SellerApplicationDetailResponse';

import { SellerProfileResponse } from '../../app/models/users/SellerProfileResponse';

import { ShopResponse } from '../../app/models/shop/ShopResponse';

import { RolesGuard } from '../core/roles.guard';

import { Roles } from '../core/roles.decorator';

import { AccountRole } from '../../domain/enums/AccountRole';

import { JwtAuthGuard } from '../core/jwtAuth.guard';

import { SellerProfileMapper } from '../services/SellerProfileMapper';

import { MediaUrlResolver } from '../services/media/MediaUrlResolver';

import { Shop } from '../../domain/entities/shop/Shop';



@ApiTags('admin')

@ApiBearerAuth('JWT-auth')

@Controller('admin')

export class AdminController {

	constructor(

		private readonly getAllSellersUseCase: GetAllSellersUseCase,

		private readonly updateAccountStatusUseCase: UpdateAccountStatusUseCase,

		private readonly reviewSellerApplicationUseCase: ReviewSellerApplicationUseCase,

		private readonly createAdminSellerUseCase: CreateAdminSellerUseCase,

		private readonly lookupAccountByEmailUseCase: LookupAccountByEmailUseCase,

		private readonly createAdminSellerByEmailUseCase: CreateAdminSellerByEmailUseCase,

		private readonly createAdminSellerWithAccountUseCase: CreateAdminSellerWithAccountUseCase,

		private readonly linkShopToSellerUseCase: LinkShopToSellerUseCase,

		private readonly unlinkShopFromSellerUseCase: UnlinkShopFromSellerUseCase,

		private readonly listAvailableSellersUseCase: ListAvailableSellersUseCase,

		private readonly listAvailableShopsUseCase: ListAvailableShopsUseCase,

		private readonly listShopsForAdminUseCase: ListShopsForAdminUseCase,

		private readonly listPendingSellerApplicationsUseCase: ListPendingSellerApplicationsUseCase,

		private readonly getSellerApplicationDetailUseCase: GetSellerApplicationDetailUseCase,

		private readonly mediaUrlResolver: MediaUrlResolver,

	) {}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Get('/shops')

	@ApiOperation({

		summary: 'Listar todas las tiendas (admin)',

		description:

			'Lista tiendas en estado ACTIVE o DEACTIVATED para gestión en dashboard.',

	})

	@ApiResponse({ status: 200, type: [ShopResponse] })

	async listShops(): Promise<ShopResponse[]> {

		const shops = await this.listShopsForAdminUseCase.handle();

		return Promise.all(shops.map((shop) => this.shopToResponse(shop)));

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Get('/shops/available')

	@ApiOperation({

		summary: 'Listar tiendas sin vendedor',

		description:

			'Tiendas sin sellerId asignado. Opcionalmente filtra por nombre.',

	})

	@ApiQuery({ name: 'search', required: false, example: 'artesanías' })

	@ApiResponse({ status: 200, type: [ShopResponse] })

	async listAvailableShops(

		@Query('search') search?: string,

	): Promise<ShopResponse[]> {

		const shops = await this.listAvailableShopsUseCase.handle(search);

		return Promise.all(shops.map((shop) => this.shopToResponse(shop)));

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Get('/sellers')

	@ApiOperation({ summary: 'Listar todos los vendedores' })

	@ApiResponse({ status: 200, type: [SellerProfileResponse] })

	async listSellers(): Promise<SellerProfileResponse[]> {

		const sellers = await this.getAllSellersUseCase.handle();

		return sellers.map((s) => SellerProfileMapper.toResponse(s));

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Get('/sellers/available')

	@ApiOperation({

		summary: 'Listar vendedores sin tienda',

		description:

			'Vendedores que no tienen ninguna tienda asignada. Opcionalmente filtra por nombre o documento.',

	})

	@ApiQuery({ name: 'search', required: false, example: 'maria' })

	@ApiResponse({ status: 200, type: [SellerProfileResponse] })

	async listAvailableSellers(

		@Query('search') search?: string,

	): Promise<SellerProfileResponse[]> {

		return this.listAvailableSellersUseCase.handle(search);

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Get('/seller-applications')

	@ApiOperation({

		summary: 'Listar solicitudes de vendedor pendientes',

		description: 'Sellers PENDING con tiendas PENDING asociadas.',

	})

	@ApiResponse({ status: 200, type: [SellerApplicationListItemResponse] })

	async listSellerApplications(): Promise<

		SellerApplicationListItemResponse[]

	> {

		const items = await this.listPendingSellerApplicationsUseCase.handle();

		return Promise.all(

			items.map(async (item) => ({

				seller: item.seller,

				shops: await Promise.all(

					item.shops.map((shop) => this.shopToResponse(shop)),

				),

			})),

		);

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Get('/seller-applications/:userId')

	@ApiOperation({

		summary: 'Detalle de solicitud de vendedor',

		description:

			'Seller PENDING con tiendas PENDING: datos completos del vendedor, cuenta, tiendas, providerInfo y sellos.',

	})

	@ApiParam({ name: 'userId', description: 'ID de la cuenta del solicitante' })

	@ApiResponse({ status: 200, type: SellerApplicationDetailResponse })

	@ApiResponse({ status: 404, description: 'Perfil de vendedor no encontrado' })

	async getSellerApplicationDetail(

		@Param('userId') userId: string,

	): Promise<SellerApplicationDetailResponse> {

		return this.getSellerApplicationDetailUseCase.handle(userId);

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Put('/account/:userId')

	@ApiOperation({

		summary: 'Actualizar estado de cuenta de usuario',

		description:

			'Solo accesible por administradores. Permite habilitar/deshabilitar cuentas de usuarios.',

	})

	@ApiResponse({ status: 200, description: 'Estado de cuenta actualizado' })

	@ApiResponse({ status: 401, description: 'No autorizado' })

	@ApiResponse({ status: 403, description: 'Se requiere rol de administrador' })

	async updateAccountStatus(

		@Param('userId') userId: string,

		@Body() body: UpdateAccountStatusDto,

	): Promise<void> {

		return this.updateAccountStatusUseCase.handle(userId, body);

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Post('/sellers')

	@HttpCode(HttpStatus.CREATED)

	@ApiOperation({

		summary: 'Crear vendedor (admin)',

		description:

			'Crea un perfil de vendedor en estado APPROVED y asigna el rol SELLER a la cuenta.',

	})

	@ApiBody({ type: CreateSellerDto })

	@ApiResponse({

		status: 201,

		description: 'Vendedor creado y aprobado',

		type: SellerProfileResponse,

	})

	async createSeller(

		@Body() body: CreateSellerDto,

	): Promise<SellerProfileResponse> {

		return this.createAdminSellerUseCase.handle(body);

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Get('/accounts/by-email')

	@ApiOperation({

		summary: 'Buscar cuenta por email (admin)',

		description:

			'Devuelve datos de la cuenta sin contraseña. Incluye si ya tiene perfil de vendedor.',

	})

	@ApiQuery({ name: 'email', required: true, example: 'maria@example.com' })

	@ApiResponse({ status: 200, type: AdminAccountLookupResponse })

	@ApiResponse({ status: 404, description: 'Usuario no encontrado' })

	async lookupAccountByEmail(

		@Query('email') email: string,

	): Promise<AdminAccountLookupResponse> {

		return this.lookupAccountByEmailUseCase.handle(email);

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Post('/sellers/by-email')

	@HttpCode(HttpStatus.CREATED)

	@ApiOperation({

		summary: 'Crear vendedor desde cuenta existente (por email)',

		description:

			'Resuelve la cuenta por email y crea el perfil de vendedor APPROVED.',

	})

	@ApiBody({ type: CreateAdminSellerByEmailDto })

	@ApiResponse({

		status: 201,

		description: 'Vendedor creado y aprobado',

		type: SellerProfileResponse,

	})

	async createSellerByEmail(

		@Body() body: CreateAdminSellerByEmailDto,

	): Promise<SellerProfileResponse> {

		return this.createAdminSellerByEmailUseCase.handle(body);

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Post('/sellers/with-account')

	@HttpCode(HttpStatus.CREATED)

	@ApiOperation({

		summary: 'Crear cuenta y vendedor (admin)',

		description:

			'Crea una cuenta ENABLED y un perfil de vendedor APPROVED en un solo paso.',

	})

	@ApiBody({ type: CreateAdminSellerWithAccountDto })

	@ApiResponse({

		status: 201,

		description: 'Cuenta y vendedor creados',

		type: SellerProfileResponse,

	})

	@ApiResponse({ status: 409, description: 'El email ya está registrado' })

	async createSellerWithAccount(

		@Body() body: CreateAdminSellerWithAccountDto,

	): Promise<SellerProfileResponse> {

		return this.createAdminSellerWithAccountUseCase.handle(body);

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Patch('/seller-applications/:userId/review')

	@ApiOperation({

		summary: 'Revisar solicitud de vendedor',

		description:

			'Aprueba o rechaza la solicitud: actualiza seller, shop(s) pendientes y rol SELLER solo si se aprueba.',

	})

	@ApiResponse({

		status: 200,

		description: 'Solicitud revisada',

	})

	@ApiResponse({ status: 404, description: 'Perfil de vendedor no encontrado' })

	async reviewSellerApplication(

		@Param('userId') userId: string,

		@Body() body: ReviewSellerApplicationDto,

	): Promise<ReviewSellerApplicationResponse> {

		const result = await this.reviewSellerApplicationUseCase.handle(

			userId,

			body.decision,

			body.rejectionReason,

		);

		return {

			seller: result.seller,

			shops: await Promise.all(

				result.shops.map((shop) => this.shopToResponse(shop)),

			),

		};

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Patch('/shops/:shopId/link-seller')

	@ApiOperation({

		summary: 'Enlazar tienda con vendedor',

		description:

			'Asocia o cambia el vendedor de una tienda. El nuevo vendedor no debe tener otra tienda. Activa la tienda y aprueba al vendedor si aplica.',

	})

	@ApiParam({ name: 'shopId', description: 'ID de la tienda' })

	@ApiBody({ type: LinkShopToSellerDto })

	@ApiResponse({

		status: 200,

		description: 'Tienda y vendedor enlazados',

		type: LinkShopToSellerResponse,

	})

	@ApiResponse({ status: 404, description: 'Tienda o vendedor no encontrado' })

	@ApiResponse({

		status: 409,

		description: 'La tienda ya tiene vendedor o el vendedor ya tiene tienda',

	})

	async linkShopToSeller(

		@Param('shopId') shopId: string,

		@Body() body: LinkShopToSellerDto,

	): Promise<LinkShopToSellerResponse> {

		const result = await this.linkShopToSellerUseCase.handle(

			shopId,

			body.sellerId,

		);

		return {

			shop: await this.shopToResponse(result.shop),

			seller: result.seller,

		};

	}



	@UseGuards(JwtAuthGuard, RolesGuard)

	@Roles(AccountRole.ADMIN)

	@Patch('/shops/:shopId/unlink-seller')

	@ApiOperation({

		summary: 'Quitar vendedor de la tienda',

		description:

			'Deja la tienda sin vendedor asignado (sellerId eliminado).',

	})

	@ApiParam({ name: 'shopId', description: 'ID de la tienda' })

	@ApiResponse({ status: 200, description: 'Vendedor desvinculado', type: ShopResponse })

	@ApiResponse({ status: 404, description: 'Tienda no encontrada' })

	async unlinkShopFromSeller(

		@Param('shopId') shopId: string,

	): Promise<ShopResponse> {

		const shop = await this.unlinkShopFromSellerUseCase.handle(shopId);

		return this.shopToResponse(shop);

	}



	private async shopToResponse(shop: Shop): Promise<ShopResponse> {

		return {

			id: shop.id,

			sellerId: shop.sellerId,

			name: shop.name,

			status: shop.status,

			categories: shop.categories,

			artisanPhotoMediaId: shop.artisanPhotoMediaId,

			artisanPhotoUrl: await this.mediaUrlResolver.resolveUrl(

				shop.artisanPhotoMediaId,

			),

			seals: shop.seals ?? [],

		};

	}

}


