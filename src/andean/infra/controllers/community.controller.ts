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
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
} from '@nestjs/swagger';
import { CreateCommunityUseCase } from '../../app/use_cases/community/CreateCommunityUseCase';
import { UpdateCommunityUseCase } from '../../app/use_cases/community/UpdateCommunityUseCase';
import { GetCommunityByIdUseCase } from '../../app/use_cases/community/GetCommunityByIdUseCase';
import { ListCommunityUseCase } from '../../app/use_cases/community/ListCommunityUseCase';
import { DeleteCommunityUseCase } from '../../app/use_cases/community/DeleteCommunityUseCase';
import { CreateCommunityDto } from './dto/community/CreateCommunityDto';
import { UpdateCommunityDto } from './dto/community/UpdateCommunityDto';
import { CommunityResponse } from '../../app/modules/CommunityResponse';
import { Community } from '../../domain/entities/community/Community';

@ApiTags('Communities')
@Controller('communities')
export class CommunityController {
	constructor(
		private readonly createCommunityUseCase: CreateCommunityUseCase,
		private readonly updateCommunityUseCase: UpdateCommunityUseCase,
		private readonly getCommunityByIdUseCase: GetCommunityByIdUseCase,
		private readonly listCommunityUseCase: ListCommunityUseCase,
		private readonly deleteCommunityUseCase: DeleteCommunityUseCase,
	) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new community' })
	@ApiResponse({
		status: 201,
		description: 'The community has been successfully created.',
		type: CommunityResponse,
	})
	@ApiResponse({ status: 400, description: 'Bad Request - Community name already exists.' })
	async create(@Body() dto: CreateCommunityDto): Promise<CommunityResponse> {
		const community = await this.createCommunityUseCase.execute(dto);
		return this.toResponse(community);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get community by ID' })
	@ApiParam({ name: 'id', description: 'Community ID' })
	@ApiResponse({
		status: 200,
		description: 'The community has been found.',
		type: CommunityResponse,
	})
	@ApiResponse({ status: 404, description: 'Community not found.' })
	async getById(@Param('id') id: string): Promise<CommunityResponse> {
		const community = await this.getCommunityByIdUseCase.execute(id);
		return this.toResponse(community);
	}

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

	@Put(':id')
	@ApiOperation({ summary: 'Update community' })
	@ApiParam({ name: 'id', description: 'Community ID' })
	@ApiResponse({
		status: 200,
		description: 'The community has been successfully updated.',
		type: CommunityResponse,
	})
	@ApiResponse({ status: 404, description: 'Community not found.' })
	@ApiResponse({ status: 400, description: 'Bad Request - Community name already exists.' })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateCommunityDto,
	): Promise<CommunityResponse> {
		const community = await this.updateCommunityUseCase.execute(id, dto);
		return this.toResponse(community);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete community' })
	@ApiParam({ name: 'id', description: 'Community ID' })
	@ApiResponse({ status: 204, description: 'The community has been deleted.' })
	@ApiResponse({ status: 404, description: 'Community not found.' })
	async delete(@Param('id') id: string): Promise<void> {
		await this.deleteCommunityUseCase.execute(id);
	}

	private toResponse(community: Community): CommunityResponse {
		return {
			id: community.id,
			name: community.name,
			createdAt: community.createdAt,
			updatedAt: community.updatedAt,
		};
	}
}
