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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateOriginProductRegionUseCase } from '../../app/use_cases/origin/CreateOriginProductRegionUseCase';
import { UpdateOriginProductRegionUseCase } from '../../app/use_cases/origin/UpdateOriginProductRegionUseCase';
import { GetOriginProductRegionByIdUseCase } from '../../app/use_cases/origin/GetOriginProductRegionByIdUseCase';
import { ListOriginProductRegionUseCase } from '../../app/use_cases/origin/ListOriginProductRegionUseCase';
import { DeleteOriginProductRegionUseCase } from '../../app/use_cases/origin/DeleteOriginProductRegionUseCase';
import { CreateOriginProductRegionDto } from './dto/origin/CreateOriginProductRegionDto';
import { UpdateOriginProductRegionDto } from './dto/origin/UpdateOriginProductRegionDto';
import { OriginProductRegionResponse } from '../../app/modules/OriginProductRegionResponse';
import { OriginProductRegion } from '../../domain/entities/origin/OriginProductRegion';

@ApiTags('Origin Product Regions')
@Controller('origin-product-regions')
export class OriginProductRegionController {
	constructor(
		private readonly createRegionUseCase: CreateOriginProductRegionUseCase,
		private readonly updateRegionUseCase: UpdateOriginProductRegionUseCase,
		private readonly getRegionByIdUseCase: GetOriginProductRegionByIdUseCase,
		private readonly listRegionUseCase: ListOriginProductRegionUseCase,
		private readonly deleteRegionUseCase: DeleteOriginProductRegionUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new origin product region' })
	@ApiResponse({
		status: 201,
		description: 'The region has been successfully created.',
		type: OriginProductRegionResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request - Region name already exists.',
	})
	async create(
		@Body() dto: CreateOriginProductRegionDto,
	): Promise<OriginProductRegionResponse> {
		const region = await this.createRegionUseCase.execute(dto);
		return this.toResponse(region);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get origin product region by ID' })
	@ApiParam({ name: 'id', description: 'Region ID' })
	@ApiResponse({
		status: 200,
		description: 'The region has been found.',
		type: OriginProductRegionResponse,
	})
	@ApiResponse({ status: 404, description: 'Region not found.' })
	async getById(@Param('id') id: string): Promise<OriginProductRegionResponse> {
		const region = await this.getRegionByIdUseCase.execute(id);
		return this.toResponse(region);
	}

	@Get()
	@ApiOperation({ summary: 'List all origin product regions' })
	@ApiResponse({
		status: 200,
		description: 'List of regions.',
		type: [OriginProductRegionResponse],
	})
	async list(): Promise<OriginProductRegionResponse[]> {
		const regions = await this.listRegionUseCase.execute();
		return regions.map((r) => this.toResponse(r));
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update origin product region' })
	@ApiParam({ name: 'id', description: 'Region ID' })
	@ApiResponse({
		status: 200,
		description: 'The region has been successfully updated.',
		type: OriginProductRegionResponse,
	})
	@ApiResponse({ status: 404, description: 'Region not found.' })
	@ApiResponse({
		status: 400,
		description: 'Bad Request - Region name already exists.',
	})
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateOriginProductRegionDto,
	): Promise<OriginProductRegionResponse> {
		const region = await this.updateRegionUseCase.execute(id, dto);
		return this.toResponse(region);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete origin product region' })
	@ApiParam({ name: 'id', description: 'Region ID' })
	@ApiResponse({ status: 204, description: 'The region has been deleted.' })
	@ApiResponse({ status: 404, description: 'Region not found.' })
	async delete(@Param('id') id: string): Promise<void> {
		await this.deleteRegionUseCase.execute(id);
	}

	private toResponse(region: OriginProductRegion): OriginProductRegionResponse {
		return {
			id: region.id,
			name: region.name,
		};
	}
}
