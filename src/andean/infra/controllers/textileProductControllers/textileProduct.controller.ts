import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
	Query,
	ParseIntPipe,
} from '@nestjs/common';
import { CreateTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileProductUseCase';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { CreateTextileProductDto } from '../dto/textileProducts/CreateTextileProductDto';
import { UpdateTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileProductUseCase';
import { GetAllTextileProductsUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileProductsUseCase';
import { GetByIdTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileProductUseCase';
import { DeleteTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileProductUseCase';
import { PaginatedProductsResponse } from 'src/andean/app/modules/PaginatedProductsResponse';
import { TextileProductListItem } from 'src/andean/app/modules/TextileProductListItemResponse';
import { TextileProductDetailResponse } from 'src/andean/app/models/TextileProducts/TextileProductDetailResponse';
import { GetByIdTextileProductDetailUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileProductDetailUseCase';

@Controller('textile-products')
export class TextileProductController {
	constructor(
		private readonly createTextileProductUseCase: CreateTextileProductUseCase,
		private readonly updateTextileProductUseCase: UpdateTextileProductUseCase,
		private readonly getAllTextileProductsUseCase: GetAllTextileProductsUseCase,
		private readonly getByIdTextileProductUseCase: GetByIdTextileProductUseCase,
		private readonly deleteTextileProductUseCase: DeleteTextileProductUseCase,
		private readonly getByIdTextileProductDetailUseCase: GetByIdTextileProductDetailUseCase,
	) { }

	@Post()
	async createTextileProduct(
		@Body() body: CreateTextileProductDto,
	): Promise<TextileProduct> {
		return this.createTextileProductUseCase.handle(body);
	}

	@Put('/:id')
	async updateTextileProduct(
		@Param('id') id: string,
		@Body() body: CreateTextileProductDto,
	): Promise<TextileProduct> {
		return this.updateTextileProductUseCase.handle(id, body);
	}

	@Get()
	async getAllTextileProducts(
		@Query('page', new ParseIntPipe({ optional: true })) page?: number,
		@Query('per_page', new ParseIntPipe({ optional: true })) perPage?: number,
		@Query('color') color?: string,
		@Query('size') size?: string,
		@Query('min_price', new ParseIntPipe({ optional: true })) minPrice?: number,
		@Query('max_price', new ParseIntPipe({ optional: true })) maxPrice?: number,
		@Query('category_id') categoryId?: string,
		@Query('owner_id') ownerId?: string,
	): Promise<PaginatedProductsResponse<TextileProductListItem>> {
		const filters: any = {};
		if (page !== undefined) filters.page = page;
		if (perPage !== undefined) filters.perPage = perPage;
		if (color) filters.color = color;
		if (size) filters.size = size;
		if (minPrice !== undefined) filters.minPrice = minPrice;
		if (maxPrice !== undefined) filters.maxPrice = maxPrice;
		if (categoryId) filters.categoryId = categoryId;
		if (ownerId) filters.ownerId = ownerId;

		return this.getAllTextileProductsUseCase.handle(Object.keys(filters).length > 0 ? filters : undefined);
	}

	@Get('/:id')
	async getByIdTextileProduct(
		@Param('id') id: string,
	): Promise<TextileProduct> {
		return this.getByIdTextileProductUseCase.handle(id);
	}

	@Get('/:id/details')
	async getTextileProductDetail(
		@Param('id') id: string,
	): Promise<TextileProductDetailResponse> {
		return this.getByIdTextileProductDetailUseCase.handle(id);
	}

	@Delete('/:id')
	async deleteTextileProduct(@Param('id') id: string): Promise<void> {
		return this.deleteTextileProductUseCase.handle(id);
	}
}
