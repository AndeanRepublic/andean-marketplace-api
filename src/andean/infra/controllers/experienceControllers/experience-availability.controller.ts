import { Body, Controller, Param, Patch } from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger';
import { UpdateExcludedDatesUseCase } from 'src/andean/app/use_cases/experiences/availability/UpdateExcludedDatesUseCase';
import { UpdateAvailableDatesUseCase } from 'src/andean/app/use_cases/experiences/availability/UpdateAvailableDatesUseCase';
import {
	PatchExcludedDatesDto,
	PatchAvailableDatesDto,
} from '../dto/experiences/PatchExperiencePricesDto';
import { ExperienceAvailabilityPatchResponse } from 'src/andean/app/modules/experiences/ExperiencePatchResponse';

@ApiTags('Experiences — Availability')
@Controller('experiences/:experienceId/availability')
export class ExperienceAvailabilityController {
	constructor(
		private readonly updateExcludedDatesUseCase: UpdateExcludedDatesUseCase,
		private readonly updateAvailableDatesUseCase: UpdateAvailableDatesUseCase,
	) {}

	@Patch('excluded-dates')
	@ApiOperation({
		summary: 'Reemplazar fechas excluidas',
		description:
			'Reemplaza el array completo de fechas excluidas de la disponibilidad. Si una fecha que antes estaba excluida no se envía, queda habilitada nuevamente.',
	})
	@ApiParam({
		name: 'experienceId',
		description: 'ID único de la experiencia',
		example: '507f1f77bcf86cd799439011',
	})
	@ApiBody({ type: PatchExcludedDatesDto })
	@ApiResponse({
		status: 200,
		description: 'Fechas excluidas actualizadas exitosamente',
		type: ExperienceAvailabilityPatchResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Experiencia o disponibilidad no encontradas',
	})
	async updateExcludedDates(
		@Param('experienceId') experienceId: string,
		@Body() body: PatchExcludedDatesDto,
	): Promise<ExperienceAvailabilityPatchResponse> {
		return this.updateExcludedDatesUseCase.handle(experienceId, body);
	}

	@Patch('available-dates')
	@ApiOperation({
		summary: 'Reemplazar fechas específicas disponibles',
		description:
			'Reemplaza el array completo de fechas de inicio específicas disponibles. Aplica cuando el modo es por fechas puntuales en lugar de días de la semana.',
	})
	@ApiParam({
		name: 'experienceId',
		description: 'ID único de la experiencia',
		example: '507f1f77bcf86cd799439011',
	})
	@ApiBody({ type: PatchAvailableDatesDto })
	@ApiResponse({
		status: 200,
		description: 'Fechas disponibles actualizadas exitosamente',
		type: ExperienceAvailabilityPatchResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Experiencia o disponibilidad no encontradas',
	})
	async updateAvailableDates(
		@Param('experienceId') experienceId: string,
		@Body() body: PatchAvailableDatesDto,
	): Promise<ExperienceAvailabilityPatchResponse> {
		return this.updateAvailableDatesUseCase.handle(experienceId, body);
	}
}
