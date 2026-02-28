import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOriginProductCommunityUseCase } from '../../app/use_cases/origin/CreateOriginProductCommunityUseCase';
import { UpdateOriginProductCommunityUseCase } from '../../app/use_cases/origin/UpdateOriginProductCommunityUseCase';
import { GetOriginProductCommunityByIdUseCase } from '../../app/use_cases/origin/GetOriginProductCommunityByIdUseCase';
import { ListOriginProductCommunityUseCase } from '../../app/use_cases/origin/ListOriginProductCommunityUseCase';
import { DeleteOriginProductCommunityUseCase } from '../../app/use_cases/origin/DeleteOriginProductCommunityUseCase';
import { CreateOriginProductCommunityDto } from './dto/origin/CreateOriginProductCommunityDto';
import { OriginProductCommunityResponse } from '../../app/modules/OriginProductCommunityResponse';
import { OriginProductCommunity } from '../../domain/entities/origin/OriginProductCommunity';

@ApiTags('Origin Product Communities')
@Controller('origin-product-communities')
export class OriginProductCommunityController {
	constructor(
		private readonly createCommunityUseCase: CreateOriginProductCommunityUseCase,
		private readonly updateCommunityUseCase: UpdateOriginProductCommunityUseCase,
		private readonly getCommunityByIdUseCase: GetOriginProductCommunityByIdUseCase,
		private readonly listCommunityUseCase: ListOriginProductCommunityUseCase,
		private readonly deleteCommunityUseCase: DeleteOriginProductCommunityUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new origin product community' })
	@ApiResponse({
		status: 201,
		description: 'The community has been successfully created.',
		type: OriginProductCommunityResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request - Community name already exists.',
	})
	@ApiResponse({ status: 404, description: 'Region not found.' })
	async create(
		@Body() dto: CreateOriginProductCommunityDto,
	): Promise<OriginProductCommunityResponse> {
		const community = await this.createCommunityUseCase.execute(dto);
		return this.toResponse(community);
	}

	// @Get(':id')
	// @ApiOperation({ summary: 'Get origin product community by ID' })
	// @ApiParam({ name: 'id', description: 'Community ID' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'The community has been found.',
	// 	type: OriginProductCommunityResponse,
	// })
	// @ApiResponse({ status: 404, description: 'Community not found.' })
	// async getById(
	// 	@Param('id') id: string,
	// ): Promise<OriginProductCommunityResponse> {
	// 	const community = await this.getCommunityByIdUseCase.execute(id);
	// 	return this.toResponse(community);
	// }

	// @Get()
	// @ApiOperation({ summary: 'List all origin product communities' })
	// @ApiQuery({
	// 	name: 'regionId',
	// 	required: false,
	// 	description: 'Filter by region ID',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'List of communities.',
	// 	type: [OriginProductCommunityResponse],
	// })
	// async list(
	// 	@Query('regionId') regionId?: string,
	// ): Promise<OriginProductCommunityResponse[]> {
	// 	const communities = await this.listCommunityUseCase.execute(regionId);
	// 	return communities.map((c) => this.toResponse(c));
	// }

	// @Put(':id')
	// @ApiOperation({ summary: 'Update origin product community' })
	// @ApiParam({ name: 'id', description: 'Community ID' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'The community has been successfully updated.',
	// 	type: OriginProductCommunityResponse,
	// })
	// @ApiResponse({ status: 404, description: 'Community or Region not found.' })
	// @ApiResponse({
	// 	status: 400,
	// 	description: 'Bad Request - Community name already exists.',
	// })
	// async update(
	// 	@Param('id') id: string,
	// 	@Body() dto: UpdateOriginProductCommunityDto,
	// ): Promise<OriginProductCommunityResponse> {
	// 	const community = await this.updateCommunityUseCase.execute(id, dto);
	// 	return this.toResponse(community);
	// }

	// @Delete(':id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({ summary: 'Delete origin product community' })
	// @ApiParam({ name: 'id', description: 'Community ID' })
	// @ApiResponse({ status: 204, description: 'The community has been deleted.' })
	// @ApiResponse({ status: 404, description: 'Community not found.' })
	// async delete(@Param('id') id: string): Promise<void> {
	// 	await this.deleteCommunityUseCase.execute(id);
	// }

	private toResponse(
		community: OriginProductCommunity,
	): OriginProductCommunityResponse {
		return {
			id: community.id,
			name: community.name,
			regionId: community.regionId,
		};
	}
}
