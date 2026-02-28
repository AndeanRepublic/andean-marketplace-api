import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateVariantUseCase } from 'src/andean/app/use_cases/variant/CreateVariantUseCase';
import { CreateManyVariantsUseCase } from 'src/andean/app/use_cases/variant/CreateManyVariantsUseCase';
import { GetAllVariantsUseCase } from 'src/andean/app/use_cases/variant/GetAllVariantsUseCase';
import { GetVariantByIdUseCase } from 'src/andean/app/use_cases/variant/GetVariantByIdUseCase';
import { GetVariantsByProductIdUseCase } from 'src/andean/app/use_cases/variant/GetVariantsByProductIdUseCase';
import { UpdateVariantUseCase } from 'src/andean/app/use_cases/variant/UpdateVariantUseCase';
import { DeleteVariantUseCase } from 'src/andean/app/use_cases/variant/DeleteVariantUseCase';
import { DeleteVariantsByProductIdUseCase } from 'src/andean/app/use_cases/variant/DeleteVariantsByProductIdUseCase';
import { SyncVariantsUseCase } from 'src/andean/app/use_cases/variant/SyncVariantsUseCase';
import { Variant } from 'src/andean/domain/entities/Variant';
import { CreateVariantDto } from '../dto/variant/CreateVariantDto';
import { CreateManyVariantsDto } from '../dto/variant/CreateManyVariantsDto';
import { UpdateVariantDto } from '../dto/variant/UpdateVariantDto';
import { SyncVariantsDto } from '../dto/variant/SyncVariantsDto';

@ApiTags('Variants')
@Controller('variants')
export class VariantController {
	constructor(
		private readonly createVariantUseCase: CreateVariantUseCase,
		private readonly createManyVariantsUseCase: CreateManyVariantsUseCase,
		private readonly getAllVariantsUseCase: GetAllVariantsUseCase,
		private readonly getVariantByIdUseCase: GetVariantByIdUseCase,
		private readonly getVariantsByProductIdUseCase: GetVariantsByProductIdUseCase,
		private readonly updateVariantUseCase: UpdateVariantUseCase,
		private readonly deleteVariantUseCase: DeleteVariantUseCase,
		private readonly deleteVariantsByProductIdUseCase: DeleteVariantsByProductIdUseCase,
		private readonly syncVariantsUseCase: SyncVariantsUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new variant' })
	@ApiResponse({ status: 201, description: 'Variant created', type: Variant })
	async create(@Body() body: CreateVariantDto): Promise<Variant> {
		return this.createVariantUseCase.execute(body);
	}

	@Post('/many')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create many variants' })
	@ApiResponse({
		status: 201,
		description: 'Variants created',
		type: [Variant],
	})
	async createMany(@Body() body: CreateManyVariantsDto): Promise<Variant[]> {
		return this.createManyVariantsUseCase.execute(body);
	}

	@Put('/sync')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Sync variants for a product' })
	@ApiResponse({ status: 200, description: 'Variants synced', type: [Variant] })
	async sync(@Body() body: SyncVariantsDto): Promise<Variant[]> {
		return this.syncVariantsUseCase.execute(body);
	}

	@Get()
	@ApiOperation({ summary: 'Get all variants' })
	@ApiResponse({
		status: 200,
		description: 'List of variants',
		type: [Variant],
	})
	async getAll(): Promise<Variant[]> {
		return this.getAllVariantsUseCase.execute();
	}

	@Get('/product/:productId')
	@ApiOperation({ summary: 'Get variants by product id' })
	@ApiParam({ name: 'productId', description: 'Product id' })
	@ApiResponse({
		status: 200,
		description: 'Variants for product',
		type: [Variant],
	})
	async getByProductId(
		@Param('productId') productId: string,
	): Promise<Variant[]> {
		return this.getVariantsByProductIdUseCase.execute(productId);
	}

	@Get('/:id')
	@ApiOperation({ summary: 'Get variant by id' })
	@ApiParam({ name: 'id', description: 'Variant id' })
	@ApiResponse({ status: 200, description: 'Variant', type: Variant })
	async getById(@Param('id') id: string): Promise<Variant> {
		return this.getVariantByIdUseCase.execute(id);
	}

	@Put('/:id')
	@ApiOperation({ summary: 'Update variant' })
	@ApiParam({ name: 'id', description: 'Variant id' })
	@ApiResponse({ status: 200, description: 'Updated variant', type: Variant })
	async update(
		@Param('id') id: string,
		@Body() body: UpdateVariantDto,
	): Promise<Variant> {
		return this.updateVariantUseCase.execute(id, body);
	}

	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete variant' })
	@ApiParam({ name: 'id', description: 'Variant id' })
	@ApiResponse({ status: 204, description: 'Variant deleted' })
	async delete(@Param('id') id: string): Promise<void> {
		return this.deleteVariantUseCase.execute(id);
	}

	@Delete('/product/:productId')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete variants by product id' })
	@ApiParam({ name: 'productId', description: 'Product id' })
	@ApiResponse({ status: 204, description: 'Variants deleted for product' })
	async deleteByProductId(
		@Param('productId') productId: string,
	): Promise<void> {
		await this.deleteVariantsByProductIdUseCase.execute(productId);
	}
}
