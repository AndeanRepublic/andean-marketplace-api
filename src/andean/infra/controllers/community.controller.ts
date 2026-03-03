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
	Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateCommunityUseCase } from '../../app/use_cases/community/CreateCommunityUseCase';
import { UpdateCommunityUseCase } from '../../app/use_cases/community/UpdateCommunityUseCase';
import { GetCommunityByIdUseCase } from '../../app/use_cases/community/GetCommunityByIdUseCase';
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
import { CommunityResponse } from '../../app/modules/CommunityResponse';
import { Community } from '../../domain/entities/community/Community';
import { Seal } from '../../domain/entities/community/Seal';

const path_seals = '/seals';
const path_seals_id = '/seals/:id';

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

	// @Get(':id')
	// @ApiOperation({ summary: 'Get community by ID' })
	// @ApiParam({ name: 'id', description: 'Community ID' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'The community has been found.',
	// 	type: CommunityResponse,
	// })
	// @ApiResponse({ status: 404, description: 'Community not found.' })
	// async getById(@Param('id') id: string): Promise<CommunityResponse> {
	// 	const community = await this.getCommunityByIdUseCase.execute(id);
	// 	return this.toResponse(community);
	// }

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

	// @Put(':id')
	// @ApiOperation({ summary: 'Update community' })
	// @ApiParam({ name: 'id', description: 'Community ID' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'The community has been successfully updated.',
	// 	type: CommunityResponse,
	// })
	// @ApiResponse({ status: 404, description: 'Community not found.' })
	// @ApiResponse({
	// 	status: 400,
	// 	description: 'Bad Request - Community name already exists.',
	// })
	// async update(
	// 	@Param('id') id: string,
	// 	@Body() dto: UpdateCommunityDto,
	// ): Promise<CommunityResponse> {
	// 	const community = await this.updateCommunityUseCase.execute(id, dto);
	// 	return this.toResponse(community);
	// }

	// @Delete(':id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({ summary: 'Delete community' })
	// @ApiParam({ name: 'id', description: 'Community ID' })
	// @ApiResponse({ status: 204, description: 'The community has been deleted.' })
	// @ApiResponse({ status: 404, description: 'Community not found.' })
	// async delete(@Param('id') id: string): Promise<void> {
	// 	await this.deleteCommunityUseCase.execute(id);
	// }

	@Post(`${path_seals}/bulk`)
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create multiple seals' })
	@ApiResponse({
		status: 201,
		description: 'Seals have been successfully created.',
		type: [Seal],
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request - Invalid input data.',
	})
	@ApiResponse({ status: 404, description: 'MediaItem not found.' })
	async createManySeals(@Body() body: CreateManySealsDto): Promise<Seal[]> {
		return this.createManySealsUseCase.handle(body);
	}

	@Post(path_seals)
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new seal' })
	async createSeal(@Body() body: CreateSealDto): Promise<Seal> {
		return this.createSealUseCase.handle(body);
	}

	// @Get(path_seals)
	// async getAllSeals(): Promise<Seal[]> {
	// 	return this.getAllSealsUseCase.handle();
	// }

	// @Get(path_seals_id)
	// async getByIdSeal(@Param('id') id: string): Promise<Seal> {
	// 	return this.getByIdSealUseCase.handle(id);
	// }

	// @Put(path_seals_id)
	// async updateSeal(
	// 	@Param('id') id: string,
	// 	@Body() body: CreateSealDto,
	// ): Promise<Seal> {
	// 	return this.updateSealUseCase.handle(id, body);
	// }

	// @Delete(path_seals_id)
	// async deleteSeal(@Param('id') id: string): Promise<void> {
	// 	return this.deleteSealUseCase.handle(id);
	// }

	private toResponse(community: Community): CommunityResponse {
		return {
			id: community.id,
			name: community.name,
			createdAt: community.createdAt,
			updatedAt: community.updatedAt,
		};
	}
}
