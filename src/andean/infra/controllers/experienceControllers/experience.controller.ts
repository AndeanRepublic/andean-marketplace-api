import {
	Body,
	Controller,
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
import { CreateExperienceUseCase } from 'src/andean/app/use_cases/experiences/CreateExperienceUseCase';
import { UpdateExperienceUseCase } from 'src/andean/app/use_cases/experiences/UpdateExperienceUseCase';
import { DeleteExperienceUseCase } from 'src/andean/app/use_cases/experiences/DeleteExperienceUseCase';
import { GetAllExperiencesUseCase } from 'src/andean/app/use_cases/experiences/GetAllExperiencesUseCase';
import { GetAllExperiencesForManagementUseCase } from 'src/andean/app/use_cases/experiences/GetAllExperiencesForManagementUseCase';
import { GetByIdExperienceUseCase } from 'src/andean/app/use_cases/experiences/GetByIdExperienceUseCase';
import { CreateExperienceDto } from '../dto/experiences/CreateExperienceDto';
import { UpdateExperienceDto } from '../dto/experiences/UpdateExperienceDto';
import { Experience } from 'src/andean/domain/entities/experiences/Experience';
import { PaginatedExperiencesResponse } from 'src/andean/app/models/experiences/ExperienceListItemResponse';
import { ExperienceDetailResponse } from 'src/andean/app/models/experiences/ExperienceDetailResponse';
import { UpdateExperienceStatusUseCase } from 'src/andean/app/use_cases/experiences/UpdateExperienceStatusUseCase';
import { UpdateExperienceStatusDto } from '../dto/experiences/UpdateExperienceStatusDto';
import { ExperienceFilters } from 'src/andean/app/datastore/experiences/Experience.repo';

@ApiTags('Experiences')
@Controller('experiences')
export class ExperienceController {
	constructor(
		private readonly createExperienceUseCase: CreateExperienceUseCase,
		private readonly updateExperienceUseCase: UpdateExperienceUseCase,
		private readonly deleteExperienceUseCase: DeleteExperienceUseCase,
		private readonly getAllExperiencesUseCase: GetAllExperiencesUseCase,
		private readonly getAllExperiencesForManagementUseCase: GetAllExperiencesForManagementUseCase,
		private readonly getByIdExperienceUseCase: GetByIdExperienceUseCase,
		private readonly updateExperienceStatusUseCase: UpdateExperienceStatusUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva experiencia',
		description:
			'Crea una nueva experiencia con toda su información: datos básicos, multimedia, detalle, precios, disponibilidad e itinerario. Cada sección se almacena en su propia colección.',
	})
	@ApiResponse({
		status: 201,
		description: 'Experiencia creada exitosamente',
		type: Experience,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	@ApiResponse({
		status: 404,
		description: 'Comunidad, MediaItem o referencia no encontrada',
	})
	async create(@Body() body: CreateExperienceDto): Promise<Experience> {
		return this.createExperienceUseCase.handle(body);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Put('/:id')
	@ApiOperation({
		summary: 'Actualizar experiencia',
		description:
			'Actualiza parcialmente una experiencia existente. Solo se actualizan las secciones enviadas en el body. Los itinerarios se reemplazan completamente si se envían.',
	})
	@ApiParam({
		name: 'id',
		description: 'ID único de la experiencia',
		example: '507f1f77bcf86cd799439011',
	})
	@ApiResponse({
		status: 200,
		description: 'Experiencia actualizada exitosamente',
		type: Experience,
	})
	@ApiResponse({
		status: 404,
		description: 'Experiencia no encontrada',
	})
	async update(
		@Param('id') id: string,
		@Body() body: UpdateExperienceDto,
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
	): Promise<Experience> {
		return this.updateExperienceUseCase.handle(
			id,
			body,
			requestingUser.userId,
			requestingUser.roles,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Get('management')
	@ApiOperation({
		summary: 'Listar experiencias para dashboard (admin)',
		description:
			'Misma lista paginada que el endpoint público (incluye HIDDEN), requiere rol ADMIN. Para el catálogo público usar GET /experiences.',
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
		description: 'Cantidad por página (por defecto: 20)',
		example: 20,
	})
	@ApiQuery({
		name: 'category',
		required: false,
		type: String,
		description: 'Filtrar por categoría de experiencia',
		example: 'trekking',
	})
	@ApiQuery({
		name: 'owner_id',
		required: false,
		type: String,
		description: 'Filtrar por ID del propietario (comunidad)',
		example: '507f1f77bcf86cd799439013',
	})
	@ApiQuery({
		name: 'min_price',
		required: false,
		type: Number,
		description: 'Precio mínimo (basado en precio ADULTS)',
		example: 50,
	})
	@ApiQuery({
		name: 'max_price',
		required: false,
		type: Number,
		description: 'Precio máximo (basado en precio ADULTS)',
		example: 500,
	})
	@ApiResponse({
		status: 200,
		description: 'Lista paginada para gestión',
		type: PaginatedExperiencesResponse,
	})
	async getAllForManagement(
		@Query('page', new ParseIntPipe({ optional: true })) page?: number,
		@Query('per_page', new ParseIntPipe({ optional: true }))
		perPage?: number,
		@Query('category') category?: string,
		@Query('owner_id') ownerId?: string,
		@Query('min_price', new ParseIntPipe({ optional: true }))
		minPrice?: number,
		@Query('max_price', new ParseIntPipe({ optional: true }))
		maxPrice?: number,
	): Promise<PaginatedExperiencesResponse> {
		const filters: ExperienceFilters = {};
		if (page !== undefined) filters.page = page;
		if (perPage !== undefined) filters.perPage = perPage;
		if (category) filters.category = category;
		if (ownerId) filters.ownerId = ownerId;
		if (minPrice !== undefined) filters.minPrice = minPrice;
		if (maxPrice !== undefined) filters.maxPrice = maxPrice;

		return this.getAllExperiencesForManagementUseCase.handle(
			Object.keys(filters).length > 0 ? filters : undefined,
		);
	}

	@Public()
	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener experiencia por ID',
		description:
			'Retorna la experiencia completa con toda su información en el nuevo formato: heroDetail, information, questionSection, itinerary, moreExperiences y reviews.',
	})
	@ApiParam({
		name: 'id',
		description: 'ID único de la experiencia',
		example: '507f1f77bcf86cd799439011',
	})
	@ApiResponse({
		status: 200,
		description: 'Experiencia encontrada con toda su información expandida',
		type: ExperienceDetailResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Experiencia no encontrada',
	})
	async getById(@Param('id') id: string): Promise<ExperienceDetailResponse> {
		return this.getByIdExperienceUseCase.handle(id);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Listar experiencias con filtros',
		description:
			'Retorna una lista paginada de experiencias con filtros opcionales por categoría, comunidad y rango de precio. La respuesta incluye información resumida optimizada para listados.',
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
		description: 'Cantidad por página (por defecto: 20)',
		example: 20,
	})
	@ApiQuery({
		name: 'category',
		required: false,
		type: String,
		description: 'Filtrar por categoría de experiencia',
		example: 'trekking',
	})
	@ApiQuery({
		name: 'owner_id',
		required: false,
		type: String,
		description: 'Filtrar por ID del propietario (comunidad)',
		example: '507f1f77bcf86cd799439013',
	})
	@ApiQuery({
		name: 'min_price',
		required: false,
		type: Number,
		description: 'Precio mínimo (basado en precio ADULTS)',
		example: 50,
	})
	@ApiQuery({
		name: 'max_price',
		required: false,
		type: Number,
		description: 'Precio máximo (basado en precio ADULTS)',
		example: 500,
	})
	@ApiResponse({
		status: 200,
		description: 'Lista paginada de experiencias con información resumida',
		type: PaginatedExperiencesResponse,
	})
	async getAll(
		@Query('page', new ParseIntPipe({ optional: true })) page?: number,
		@Query('per_page', new ParseIntPipe({ optional: true }))
		perPage?: number,
		@Query('category') category?: string,
		@Query('owner_id') ownerId?: string,
		@Query('min_price', new ParseIntPipe({ optional: true }))
		minPrice?: number,
		@Query('max_price', new ParseIntPipe({ optional: true }))
		maxPrice?: number,
	): Promise<PaginatedExperiencesResponse> {
		const filters: any = {};
		if (page !== undefined) filters.page = page;
		if (perPage !== undefined) filters.perPage = perPage;
		if (category) filters.category = category;
		if (ownerId) filters.ownerId = ownerId;
		if (minPrice !== undefined) filters.minPrice = minPrice;
		if (maxPrice !== undefined) filters.maxPrice = maxPrice;

		return this.getAllExperiencesUseCase.handle(
			Object.keys(filters).length > 0 ? filters : undefined,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Patch('/:id/status')
	async updateStatus(
		@Param('id') id: string,
		@Body() body: UpdateExperienceStatusDto,
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
	): Promise<Experience> {
		return this.updateExperienceStatusUseCase.handle(
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
		summary: 'Eliminar experiencia',
		description:
			'Elimina una experiencia y todas sus sub-tablas asociadas (basicInfo, mediaInfo, detailInfo, prices, availability, itineraries)',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la experiencia a eliminar',
		example: '507f1f77bcf86cd799439011',
	})
	@ApiResponse({
		status: 204,
		description: 'Experiencia eliminada exitosamente',
	})
	@ApiResponse({
		status: 404,
		description: 'Experiencia no encontrada',
	})
	async delete(
		@Param('id') id: string,
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
	): Promise<void> {
		return this.deleteExperienceUseCase.handle(
			id,
			requestingUser.userId,
			requestingUser.roles,
		);
	}
}
