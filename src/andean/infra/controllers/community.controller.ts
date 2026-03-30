import {
	Controller,
	Get,
	Post,
	Patch,
	Put,
	Delete,
	Body,
	Param,
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
import { CreateCommunityUseCase } from '../../app/use_cases/community/CreateCommunityUseCase';
import { UpdateCommunityUseCase } from '../../app/use_cases/community/UpdateCommunityUseCase';
import { GetCommunityByIdUseCase } from '../../app/use_cases/community/GetCommunityByIdUseCase';
import type { CommunityWithProviderInfo } from '../../app/use_cases/community/GetCommunityByIdUseCase';
import { ListCommunityUseCase } from '../../app/use_cases/community/ListCommunityUseCase';
import { DeleteCommunityUseCase } from '../../app/use_cases/community/DeleteCommunityUseCase';
import { CreateSealUseCase } from '../../app/use_cases/community/CreateSealUseCase';
import { CreateManySealsUseCase } from '../../app/use_cases/community/CreateManySealsUseCase';
import { GetAllSealsUseCase } from '../../app/use_cases/community/GetAllSealsUseCase';
import { GetByIdSealUseCase } from '../../app/use_cases/community/GetByIdSealUseCase';
import { UpdateSealUseCase } from '../../app/use_cases/community/UpdateSealUseCase';
import { DeleteSealUseCase } from '../../app/use_cases/community/DeleteSealUseCase';
import { CreateCommunityDto } from './dto/community/CreateCommunityDto';
import { UpdateCommunityDto } from './dto/community/UpdateCommunityDto';
import { CreateSealDto } from './dto/community/CreateSealDto';
import { CreateManySealsDto } from './dto/community/CreateManySealsDto';
import { CommunityResponse } from '../../app/models/community/CommunityResponse';
import { CommunityDetailResponse } from '../../app/models/community/CommunityDetailResponse';
import { SealResponse } from '../../app/models/community/SealResponse';
import { Community } from '../../domain/entities/community/Community';
import { Seal } from '../../domain/entities/community/Seal';
import { ProviderInfo } from '../../domain/entities/ProviderInfo';

const path_seals = 'seals';
const path_seals_id = 'seals/:id';

@ApiTags('Communities')
@Controller('communities')
export class CommunityController {
	constructor(
		private readonly createCommunityUseCase: CreateCommunityUseCase,
		private readonly updateCommunityUseCase: UpdateCommunityUseCase,
		private readonly getCommunityByIdUseCase: GetCommunityByIdUseCase,
		private readonly listCommunityUseCase: ListCommunityUseCase,
		private readonly deleteCommunityUseCase: DeleteCommunityUseCase,
		private readonly createSealUseCase: CreateSealUseCase,
		private readonly createManySealsUseCase: CreateManySealsUseCase,
		private readonly getAllSealsUseCase: GetAllSealsUseCase,
		private readonly getByIdSealUseCase: GetByIdSealUseCase,
		private readonly updateSealUseCase: UpdateSealUseCase,
		private readonly deleteSealUseCase: DeleteSealUseCase,
	) {}

	@Public()
	@Get(path_seals)
	@ApiOperation({
		summary: 'Listar todos los sellos',
		description: 'Retorna la lista completa de sellos de comunidad disponibles',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de sellos',
		type: [SealResponse],
	})
	async getAllSeals(): Promise<Seal[]> {
		return this.getAllSealsUseCase.handle();
	}

	@Public()
	@Get(path_seals_id)
	@ApiOperation({ summary: 'Obtener sello por ID' })
	@ApiParam({ name: 'id', description: 'Sello ID' })
	@ApiResponse({ status: 200, description: 'Sello encontrado', type: SealResponse })
	@ApiResponse({ status: 404, description: 'Sello no encontrado' })
	async getByIdSeal(@Param('id') id: string): Promise<Seal> {
		return this.getByIdSealUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Put(path_seals_id)
	@ApiOperation({ summary: 'Actualizar sello' })
	@ApiParam({ name: 'id', description: 'Sello ID' })
	@ApiResponse({ status: 200, description: 'Sello actualizado', type: SealResponse })
	@ApiResponse({ status: 404, description: 'Sello no encontrado' })
	async updateSeal(
		@Param('id') id: string,
		@Body() body: CreateSealDto,
	): Promise<Seal> {
		return this.updateSealUseCase.handle(id, body);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Delete(path_seals_id)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Eliminar sello' })
	@ApiParam({ name: 'id', description: 'Sello ID' })
	@ApiResponse({ status: 204, description: 'Sello eliminado' })
	@ApiResponse({ status: 404, description: 'Sello no encontrado' })
	async deleteSeal(@Param('id') id: string): Promise<void> {
		return this.deleteSealUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new community' })
	@ApiResponse({
		status: 201,
		description: 'The community has been successfully created.',
		type: CommunityResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request - Community name already exists.',
	})
	async create(@Body() dto: CreateCommunityDto): Promise<CommunityResponse> {
		const community = await this.createCommunityUseCase.execute(dto);
		return this.toResponse(community);
	}

	@Public()
	@Get()
	@ApiOperation({ summary: 'List all communities' })
	@ApiResponse({
		status: 200,
		description: 'List of communities.',
		type: [CommunityResponse],
	})
	async list(): Promise<CommunityResponse[]> {
		const communities = await this.listCommunityUseCase.execute();
		return communities.map((c) => this.toResponse(c));
	}

	@Public()
	@Get(':id')
	@ApiOperation({ summary: 'Get community by ID (detalle para edición)' })
	@ApiParam({ name: 'id', description: 'Community ID' })
	@ApiResponse({
		status: 200,
		description: 'The community has been found.',
		type: CommunityDetailResponse,
	})
	@ApiResponse({ status: 404, description: 'Community not found.' })
	async getById(@Param('id') id: string): Promise<CommunityDetailResponse> {
		const community = await this.getCommunityByIdUseCase.execute(id);
		return this.toDetailResponse(community);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Patch(':id')
	@ApiOperation({ summary: 'Update community' })
	@ApiParam({ name: 'id', description: 'Community ID' })
	@ApiResponse({
		status: 200,
		description: 'The community has been successfully updated.',
		type: CommunityDetailResponse,
	})
	@ApiResponse({ status: 404, description: 'Community not found.' })
	@ApiResponse({
		status: 400,
		description: 'Bad Request - Community name already exists.',
	})
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateCommunityDto,
	): Promise<CommunityDetailResponse> {
		await this.updateCommunityUseCase.execute(id, dto);
		const community = await this.getCommunityByIdUseCase.execute(id);
		return this.toDetailResponse(community);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete community' })
	@ApiParam({ name: 'id', description: 'Community ID' })
	@ApiResponse({ status: 204, description: 'The community has been deleted.' })
	@ApiResponse({ status: 404, description: 'Community not found.' })
	async delete(@Param('id') id: string): Promise<void> {
		await this.deleteCommunityUseCase.execute(id);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post(`/${path_seals}/bulk`)
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples sellos',
		description:
			'Crea múltiples sellos de comunidad en una sola operación. Útil para carga inicial de datos.',
	})
	@ApiBody({ type: CreateManySealsDto })
	@ApiResponse({
		status: 201,
		description: 'Sellos creados exitosamente',
		type: [SealResponse],
	})
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	@ApiResponse({ status: 404, description: 'MediaItem no encontrado' })
	async createManySeals(@Body() body: CreateManySealsDto): Promise<Seal[]> {
		return this.createManySealsUseCase.handle(body);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post(`/${path_seals}`)
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear un nuevo sello',
		description:
			'Crea un nuevo sello de comunidad con su nombre, descripción y logo',
	})
	@ApiBody({ type: CreateSealDto })
	@ApiResponse({
		status: 201,
		description: 'Sello creado exitosamente',
		type: SealResponse,
	})
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	@ApiResponse({ status: 404, description: 'MediaItem no encontrado' })
	async createSeal(@Body() body: CreateSealDto): Promise<Seal> {
		return this.createSealUseCase.handle(body);
	}

	private toResponse(community: Community): CommunityResponse {
		return {
			id: community.id,
			name: community.name,
			createdAt: community.createdAt,
			updatedAt: community.updatedAt,
		};
	}

	private toDetailResponse(
		data: CommunityWithProviderInfo,
	): CommunityDetailResponse {
		const base = this.toResponse(data);
		return {
			...base,
			bannerImageId: data.bannerImageId,
			seals: data.seals ?? [],
			providerInfo: data.providerInfo
				? this.providerInfoToPlain(data.providerInfo)
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
