import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CreateBoxUseCase } from '../../app/use_cases/boxes/CreateBoxUseCase';
import { GetAllBoxesUseCase } from '../../app/use_cases/boxes/GetAllBoxesUseCase';
import { GetBoxDetailUseCase } from '../../app/use_cases/boxes/GetBoxDetailUseCase';
import { Box } from '../../domain/entities/box/Box';
import { CreateBoxDto } from './dto/box/CreateBoxDto';
import { BoxListPaginatedResponse } from '../../app/models/box/BoxListResponse';
import { BoxDetailResponse } from '../../app/models/box/BoxDetailResponse';

@Controller('boxes')
export class BoxController {
	constructor(
		private readonly createBoxUseCase: CreateBoxUseCase,
		private readonly getAllBoxesUseCase: GetAllBoxesUseCase,
		private readonly getBoxDetailUseCase: GetBoxDetailUseCase,
	) { }

	@Post('')
	async createBox(@Body() createBoxDto: CreateBoxDto): Promise<Box> {
		return this.createBoxUseCase.handle(createBoxDto);
	}

	@Get('')
	async getAllBoxes(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('per_page', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
	): Promise<BoxListPaginatedResponse> {
		return this.getAllBoxesUseCase.handle(page, perPage);
	}

	@Get('/:boxId')
	async getBoxDetail(@Param('boxId') boxId: string): Promise<BoxDetailResponse> {
		return this.getBoxDetailUseCase.handle(boxId);
	}
}
