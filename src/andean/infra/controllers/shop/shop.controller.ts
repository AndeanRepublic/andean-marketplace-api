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
import { JwtAuthGuard } from '../../core/jwtAuth.guard';
import { RolesGuard } from '../../core/roles.guard';
import { Roles } from '../../core/roles.decorator';
import { AccountRole } from '../../../domain/enums/AccountRole';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger';
import { Public } from '../../core/public.decorator';
import { GetShopByIdUseCase } from '../../../app/use_cases/shop/GetShopByIdUseCase';
import { GetShopsByCategoryUseCase } from '../../../app/use_cases/shop/GetShopsByCategoryUseCase';
import { GetShopsBySellerIdUseCase } from '../../../app/use_cases/shop/GetShopsBySellerIdUseCase';
import { DeleteShopUseCase } from '../../../app/use_cases/shop/DeleteShopUseCase';
import { CreateShopUseCase } from '../../../app/use_cases/shop/CreateShopUseCase';
import { ListAllShopsUseCase } from '../../../app/use_cases/shop/ListAllShopsUseCase';
import { Shop } from '../../../domain/entities/shop/Shop';
import { CreateShopDto } from '../dto/shop/CreateShopDto';
import { UpdateShopDto } from '../dto/shop/UpdateShopDto';
import { UpdateShopUseCase } from '../../../app/use_cases/shop/UpdateShopUseCase';
import { ShopResponse } from '../../../app/models/shop/ShopResponse';
import { CurrentUser } from '../../core/current-user.decorator';
import { MediaUrlResolver } from '../../services/media/MediaUrlResolver';
import type { ShopWithProviderInfo } from '../../../app/use_cases/shop/GetShopByIdUseCase';
import { ProviderInfo } from '../../../domain/entities/ProviderInfo';
import { UpdateShopStatusUseCase } from '../../../app/use_cases/shop/UpdateShopStatusUseCase';
import { UpdateShopStatusDto } from '../dto/shop/UpdateShopStatusDto';
import { CreateSellerApplicationUseCase } from '../../../app/use_cases/shop/CreateSellerApplicationUseCase';
import { CreateSellerApplicationDto } from '../dto/shop/CreateSellerApplicationDto';
import { SellerApplicationResponse } from '../../../app/models/shop/SellerApplicationResponse';
import { SellerProfileMapper } from '../../services/SellerProfileMapper';
import { UpdateShopVisibilityUseCase } from '../../../app/use_cases/shop/UpdateShopVisibilityUseCase';
import { UpdateShopVisibilityDto } from '../dto/shop/UpdateShopVisibilityDto';
import { ShopStatus } from '../../../domain/enums/ShopStatus';

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
		private readonly mediaUrlResolver: MediaUrlResolver,
		private readonly updateShopStatusUseCase: UpdateShopStatusUseCase,
		private readonly createSellerApplicationUseCase: CreateSellerApplicationUseCase,
		private readonly updateShopVisibilityUseCase: UpdateShopVisibilityUseCase,
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
	async listAll(): Promise<ShopResponse[]> {
		const shops = await this.listAllShopsUseCase.handle();
		return Promise.all(shops.map((shop) => this.toResponse(shop)));
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
	async finBySeller(
		@Param('sellerId') sellerId: string,
	): Promise<ShopResponse[]> {
		const shops = await this.getShopsBySellerIdUseCase.handle(sellerId);
		return Promise.all(shops.map((shop) => this.toResponse(shop)));
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
	): Promise<ShopResponse[]> {
		const shops = await this.getShopsByCategoryUseCase.handle(categoryName);
		return Promise.all(shops.map((shop) => this.toResponse(shop)));
	}

	@UseGuards(JwtAuthGuard)
	@Post('seller-application')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Solicitar convertirse en vendedor',
		description:
			'Usuario autenticado envía perfil de vendedor y tienda. Crea Seller PENDING y Shop PENDING sin asignar rol SELLER.',
	})
	@ApiBody({ type: CreateSellerApplicationDto })
	@ApiResponse({
		status: 201,
		description: 'Solicitud registrada',
		type: SellerApplicationResponse,
	})
	async createSellerApplication(
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
		@Body() dto: CreateSellerApplicationDto,
	): Promise<SellerApplicationResponse> {
		const result = await this.createSellerApplicationUseCase.handle(
			requestingUser.userId,
			dto,
		);
		return {
			seller: SellerProfileMapper.toResponse(result.seller),
			shop: await this.toResponse(result.shop),
		};
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
	async findById(
		@Param('shopId') shopId: string,
	): Promise<ShopResponse & { providerInfo?: Record<string, unknown> }> {
		const shop = await this.getShopsByIdUseCase.handle(shopId);
		return this.toResponse(shop);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post('')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear una nueva tienda',
		description:
			'Admin o vendedor aprobado crea una tienda en estado ACTIVE. sellerId es opcional para admin; el vendedor solo puede crear para su propio perfil. Distinto de POST /shops/seller-application (solicitud PENDING).',
	})
	@ApiBody({ type: CreateShopDto })
	@ApiResponse({
		status: 201,
		description: 'Tienda creada exitosamente',
		type: ShopResponse,
	})
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	@ApiResponse({ status: 404, description: 'Vendedor no encontrado' })
	async createShop(
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
		@Body() createShopDto: CreateShopDto,
	): Promise<ShopResponse> {
		const shop = await this.createShopUseCase.handle(createShopDto, {
			initialStatus: ShopStatus.ACTIVE,
			requestingUserId: requestingUser.userId,
			roles: requestingUser.roles,
		});
		return this.toResponse(shop);
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
	@Roles(AccountRole.ADMIN)
	@Patch(':shopId/status')
	@ApiOperation({
		summary: 'Actualizar estado de tienda (admin)',
		description:
			'Solo administradores. Permite PENDING, ACTIVE, REJECTED o DEACTIVATED.',
	})
	async updateStatus(
		@Param('shopId') shopId: string,
		@Body() dto: UpdateShopStatusDto,
	): Promise<ShopResponse & { providerInfo?: Record<string, unknown> }> {
		await this.updateShopStatusUseCase.handle(shopId, dto.status);
		const shop = await this.getShopsByIdUseCase.handle(shopId);
		return this.toResponse(shop);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Patch(':shopId/visibility')
	@ApiOperation({
		summary: 'Cambiar visibilidad de la tienda',
		description:
			'Vendedor aprobado puede alternar entre ACTIVE y DEACTIVATED en su propia tienda.',
	})
	async updateVisibility(
		@Param('shopId') shopId: string,
		@Body() dto: UpdateShopVisibilityDto,
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
	): Promise<ShopResponse & { providerInfo?: Record<string, unknown> }> {
		const shop = await this.updateShopVisibilityUseCase.handle(
			shopId,
			dto.status,
			requestingUser.userId,
			requestingUser.roles,
		);
		return this.toResponse(shop);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Patch(':shopId')
	@ApiOperation({
		summary: 'Actualizar tienda',
		description: 'Actualiza los datos de una tienda existente',
	})
	@ApiParam({ name: 'shopId', description: 'ID de la tienda', type: String })
	@ApiResponse({
		status: 200,
		description: 'Tienda actualizada',
		type: ShopResponse,
	})
	@ApiResponse({ status: 404, description: 'Tienda no encontrada' })
	async updateShop(
		@Param('shopId') shopId: string,
		@Body() dto: UpdateShopDto,
	): Promise<ShopResponse & { providerInfo?: Record<string, unknown> }> {
		await this.updateShopUseCase.handle(shopId, dto);
		const shop = await this.getShopsByIdUseCase.handle(shopId);
		return this.toResponse(shop);
	}

	private async toResponse(
		shop: Shop | ShopWithProviderInfo,
	): Promise<ShopResponse & { providerInfo?: Record<string, unknown> }> {
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
			providerInfo:
				'providerInfo' in shop && shop.providerInfo
					? this.providerInfoToPlain(shop.providerInfo)
					: undefined,
		};
	}

	private providerInfoToPlain(p: ProviderInfo): Record<string, unknown> {
		return {
			craftType: p.craftType,
			tagline: p.tagline,
			shortBio: p.shortBio,
			originPlace: p.originPlace,
			testimonialsOrAwards: p.testimonialsOrAwards,
			workplacePhotoMediaId: p.workplacePhotoMediaId,
			presentationVideoMediaId: p.presentationVideoMediaId,
			isPartOfOrganization: p.isPartOfOrganization,
			organizationName: p.organizationName,
			memberCount: p.memberCount,
			exactLocation: p.exactLocation,
			contactAddress: p.contactAddress,
			contactPhone: p.contactPhone,
			contactEmail: p.contactEmail,
			spokenLanguages: p.spokenLanguages,
			hasInternetAccess: p.hasInternetAccess,
			connectionTypes: p.connectionTypes,
			extendedStory: p.extendedStory,
			foundingYear: p.foundingYear,
			projectTimeline: p.projectTimeline,
			womenArtisanPercentage: p.womenArtisanPercentage,
			includesPeopleWithDisabilities: p.includesPeopleWithDisabilities,
			hasYouthInvolvement: p.hasYouthInvolvement,
			indirectBeneficiaryChildren: p.indirectBeneficiaryChildren,
			averageArtisanAge: p.averageArtisanAge,
			parallelActivities: p.parallelActivities,
			programParticipation: p.programParticipation,
			trainingReceived: p.trainingReceived,
		};
	}
}
