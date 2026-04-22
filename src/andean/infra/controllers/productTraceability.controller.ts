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
import { CreateProductTraceabilityUseCase } from '../../app/use_cases/traceability/CreateProductTraceabilityUseCase';
import { UpdateProductTraceabilityUseCase } from '../../app/use_cases/traceability/UpdateProductTraceabilityUseCase';
import { GetProductTraceabilityByIdUseCase } from '../../app/use_cases/traceability/GetProductTraceabilityByIdUseCase';
import { ListProductTraceabilityUseCase } from '../../app/use_cases/traceability/ListProductTraceabilityUseCase';
import { DeleteProductTraceabilityUseCase } from '../../app/use_cases/traceability/DeleteProductTraceabilityUseCase';
import { CreateProductTraceabilityDto } from './dto/traceability/CreateProductTraceabilityDto';
import { UpdateProductTraceabilityDto } from './dto/traceability/UpdateProductTraceabilityDto';
import { ProductTraceabilityResponse } from '../../app/models/shared/ProductTraceabilityResponse';
import { ProductTraceability } from '../../domain/entities/ProductTraceability';

@ApiTags('Product Traceability')
@Controller('product-traceability')
export class ProductTraceabilityController {
	constructor(
		private readonly createTraceabilityUseCase: CreateProductTraceabilityUseCase,
		private readonly updateTraceabilityUseCase: UpdateProductTraceabilityUseCase,
		private readonly getTraceabilityByIdUseCase: GetProductTraceabilityByIdUseCase,
		private readonly listTraceabilityUseCase: ListProductTraceabilityUseCase,
		private readonly deleteTraceabilityUseCase: DeleteProductTraceabilityUseCase,
	) {}

	// @Post()
	// @HttpCode(HttpStatus.CREATED)
	// @ApiOperation({ summary: 'Create product traceability' })
	// @ApiResponse({
	// 	status: 201,
	// 	description: 'The traceability has been successfully created.',
	// 	type: ProductTraceabilityResponse,
	// })
	// @ApiResponse({ status: 400, description: 'Bad Request.' })
	// async create(
	// 	@Body() dto: CreateProductTraceabilityDto,
	// ): Promise<ProductTraceabilityResponse> {
	// 	const traceability = await this.createTraceabilityUseCase.execute(dto);
	// 	return this.toResponse(traceability);
	// }

	// @Get(':id')
	// @ApiOperation({ summary: 'Get product traceability by ID' })
	// @ApiParam({ name: 'id', description: 'Traceability ID' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'The traceability has been found.',
	// 	type: ProductTraceabilityResponse,
	// })
	// @ApiResponse({ status: 404, description: 'Traceability not found.' })
	// async getById(@Param('id') id: string): Promise<ProductTraceabilityResponse> {
	// 	const traceability = await this.getTraceabilityByIdUseCase.execute(id);
	// 	return this.toResponse(traceability);
	// }

	// @Get()
	// @ApiOperation({ summary: 'List all product traceabilities' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'List of traceabilities.',
	// 	type: [ProductTraceabilityResponse],
	// })
	// async list(): Promise<ProductTraceabilityResponse[]> {
	// 	const traceabilities = await this.listTraceabilityUseCase.execute();
	// 	return traceabilities.map((t) => this.toResponse(t));
	// }

	// @Put(':id')
	// @ApiOperation({ summary: 'Update product traceability' })
	// @ApiParam({ name: 'id', description: 'Traceability ID' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'The traceability has been successfully updated.',
	// 	type: ProductTraceabilityResponse,
	// })
	// @ApiResponse({ status: 404, description: 'Traceability not found.' })
	// @ApiResponse({ status: 400, description: 'Bad Request.' })
	// async update(
	// 	@Param('id') id: string,
	// 	@Body() dto: UpdateProductTraceabilityDto,
	// ): Promise<ProductTraceabilityResponse> {
	// 	const traceability = await this.updateTraceabilityUseCase.execute(id, dto);
	// 	return this.toResponse(traceability);
	// }

	// @Delete(':id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({ summary: 'Delete product traceability' })
	// @ApiParam({ name: 'id', description: 'Traceability ID' })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'The traceability has been deleted.',
	// })
	// @ApiResponse({ status: 404, description: 'Traceability not found.' })
	// async delete(@Param('id') id: string): Promise<void> {
	// 	await this.deleteTraceabilityUseCase.execute(id);
	// }

	// private toResponse(
	// 	traceability: ProductTraceability,
	// ): ProductTraceabilityResponse {
	// 	return {
	// 		id: traceability.id,
	// 		blockchainLink: traceability.blockchainLink,
	// 		epochs: traceability.epochs.map((epoch) => ({
	// 			title: epoch.title,
	// 			country: epoch.country,
	// 			city: epoch.city,
	// 			description: epoch.description,
	// 			processName: epoch.processName,
	// 			supplier: epoch.supplier,
	// 		})),
	// 	};
	// }
}
