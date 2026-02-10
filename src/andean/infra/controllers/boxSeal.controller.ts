import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBoxSealUseCase } from '../../app/use_cases/boxSeals/CreateBoxSealUseCase';
import { GetAllBoxSealsUseCase } from '../../app/use_cases/boxSeals/GetAllBoxSealsUseCase';
import { GetBoxSealByIdUseCase } from '../../app/use_cases/boxSeals/GetBoxSealByIdUseCase';
import { UpdateBoxSealUseCase } from '../../app/use_cases/boxSeals/UpdateBoxSealUseCase';
import { DeleteBoxSealUseCase } from '../../app/use_cases/boxSeals/DeleteBoxSealUseCase';
import { BoxSeal } from '../../domain/entities/box/BoxSeal';
import { CreateBoxSealDto } from './dto/box/CreateBoxSealDto';
import { UpdateBoxSealDto } from './dto/box/UpdateBoxSealDto';

@ApiTags('Box Seals')
@Controller('box-seals')
export class BoxSealController {
	constructor(
		private readonly createBoxSealUseCase: CreateBoxSealUseCase,
		private readonly getAllBoxSealsUseCase: GetAllBoxSealsUseCase,
		private readonly getBoxSealByIdUseCase: GetBoxSealByIdUseCase,
		private readonly updateBoxSealUseCase: UpdateBoxSealUseCase,
		private readonly deleteBoxSealUseCase: DeleteBoxSealUseCase,
	) { }

	@Post('')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo sello de box',
		description: 'Crea un nuevo sello (certificación) que puede ser asociado a boxes. Requiere nombre, descripción y un media ID del logo.',
	})
	@ApiResponse({
		status: 201,
		description: 'Sello creado exitosamente',
		type: BoxSeal,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createBoxSeal(@Body() dto: CreateBoxSealDto): Promise<BoxSeal> {
		return this.createBoxSealUseCase.handle(dto);
	}

	// @Get('')
	// async getAllBoxSeals(): Promise<BoxSeal[]> {
	// 	return this.getAllBoxSealsUseCase.handle();
	// }

	// @Get('/:id')
	// async getBoxSealById(@Param('id') id: string): Promise<BoxSeal> {
	// 	return this.getBoxSealByIdUseCase.handle(id);
	// }

	// @Put('/:id')
	// async updateBoxSeal(
	// 	@Param('id') id: string,
	// 	@Body() dto: UpdateBoxSealDto,
	// ): Promise<BoxSeal> {
	// 	return this.updateBoxSealUseCase.handle(id, dto);
	// }

	// @Delete('/:id')
	// async deleteBoxSeal(@Param('id') id: string): Promise<void> {
	// 	return this.deleteBoxSealUseCase.handle(id);
	//}
}
