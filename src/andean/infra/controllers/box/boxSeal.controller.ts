import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BoxSealResponse } from '../../../app/modules/box/BoxSealResponse';
import { CreateBoxSealUseCase } from '../../../app/use_cases/boxSeals/CreateBoxSealUseCase';
import { GetAllBoxSealsUseCase } from '../../../app/use_cases/boxSeals/GetAllBoxSealsUseCase';
import { GetBoxSealByIdUseCase } from '../../../app/use_cases/boxSeals/GetBoxSealByIdUseCase';
import { UpdateBoxSealUseCase } from '../../../app/use_cases/boxSeals/UpdateBoxSealUseCase';
import { DeleteBoxSealUseCase } from '../../../app/use_cases/boxSeals/DeleteBoxSealUseCase';
import { BoxSeal } from '../../../domain/entities/box/BoxSeal';
import { CreateBoxSealDto } from '../dto/box/CreateBoxSealDto';
import { CreateManyBoxSealsDto } from '../dto/box/CreateManyBoxSealsDto';
import { UpdateBoxSealDto } from '../dto/box/UpdateBoxSealDto';
import { CreateManyBoxSealsUseCase } from '../../../app/use_cases/boxSeals/CreateManyBoxSealsUseCase';

@ApiTags('Box Seals')
@Controller('box-seals')
export class BoxSealController {
	constructor(
		private readonly createBoxSealUseCase: CreateBoxSealUseCase,
		private readonly createManyBoxSealsUseCase: CreateManyBoxSealsUseCase,
		private readonly getAllBoxSealsUseCase: GetAllBoxSealsUseCase,
		private readonly getBoxSealByIdUseCase: GetBoxSealByIdUseCase,
		private readonly updateBoxSealUseCase: UpdateBoxSealUseCase,
		private readonly deleteBoxSealUseCase: DeleteBoxSealUseCase,
	) {}

	@Post('')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nuevo sello de box',
		description:
			'Crea un nuevo sello (certificación) que puede ser asociado a boxes. Requiere nombre, descripción y un media ID del logo.',
	})
	@ApiBody({ type: CreateBoxSealDto })
	@ApiResponse({
		status: 201,
		description: 'Sello creado exitosamente',
		type: BoxSealResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createBoxSeal(@Body() dto: CreateBoxSealDto): Promise<BoxSeal> {
		return this.createBoxSealUseCase.handle(dto);
	}

	@Post('/bulk')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear múltiples sellos de box',
		description: 'Crea múltiples sellos en una sola operación.',
	})
	@ApiBody({ type: CreateManyBoxSealsDto })
	@ApiResponse({
		status: 201,
		description: 'Sellos creados exitosamente',
		type: [BoxSealResponse],
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createManyBoxSeals(
		@Body() dto: CreateManyBoxSealsDto,
	): Promise<BoxSeal[]> {
		return this.createManyBoxSealsUseCase.handle(dto);
	}

	@Get('')
	@ApiOperation({ summary: 'Obtener todos los sellos de box' })
	@ApiResponse({
		status: 200,
		description: 'Lista de sellos',
		type: [BoxSealResponse],
	})
	async getAllBoxSeals(): Promise<BoxSeal[]> {
		return this.getAllBoxSealsUseCase.handle();
	}

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
