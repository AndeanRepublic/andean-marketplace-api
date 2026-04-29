import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/jwtAuth.guard';
import { RolesGuard } from '../../core/roles.guard';
import { Roles } from '../../core/roles.decorator';
import { CurrentUser } from '../../core/current-user.decorator';
import { Public } from '../../core/public.decorator';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { UpdateExcludedDatesUseCase } from 'src/andean/app/use_cases/experiences/availability/UpdateExcludedDatesUseCase';
import { UpdateAvailableDatesUseCase } from 'src/andean/app/use_cases/experiences/availability/UpdateAvailableDatesUseCase';
import { GetSharedCapacityByDateRangeUseCase } from 'src/andean/app/use_cases/experiences/availability/GetSharedCapacityByDateRangeUseCase';
import {
	PatchExcludedDatesDto,
	PatchAvailableDatesDto,
} from '../dto/experiences/PatchExperiencePricesDto';
import { ExperienceAvailabilityPatchResponse } from 'src/andean/app/models/experiences/ExperiencePatchResponse';
import { GetSharedCapacityRangeDto } from '../dto/experiences/GetSharedCapacityRangeDto';
import { ExperienceSharedCapacityRangeResponse } from 'src/andean/app/models/experiences/ExperienceSharedCapacityRangeResponse';

@ApiTags('Experiences — Availability')
@Controller('experiences/:experienceId/availability')
export class ExperienceAvailabilityController {
	constructor(
		private readonly updateExcludedDatesUseCase: UpdateExcludedDatesUseCase,
		private readonly updateAvailableDatesUseCase: UpdateAvailableDatesUseCase,
		private readonly getSharedCapacityByDateRangeUseCase: GetSharedCapacityByDateRangeUseCase,
	) {}

	@Public()
	@Get('shared-capacity')
	@ApiOperation({
		summary: 'Consultar cupos por rango (experiencias comunitarias)',
		description:
			'Retorna los cupos reservados/restantes por fecha en un rango acotado. Solo aplica para experiencias en modo sharedCapacity.',
	})
	@ApiParam({
		name: 'experienceId',
		description: 'ID único de la experiencia',
		example: '507f1f77bcf86cd799439011',
	})
	@ApiResponse({
		status: 200,
		description: 'Cupos por fecha retornados exitosamente',
		type: ExperienceSharedCapacityRangeResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Rango inválido o experiencia no está en sharedCapacity',
	})
	@ApiResponse({
		status: 404,
		description: 'Experiencia o disponibilidad no encontradas',
	})
	async getSharedCapacityByDateRange(
		@Param('experienceId') experienceId: string,
		@Query() query: GetSharedCapacityRangeDto,
	): Promise<ExperienceSharedCapacityRangeResponse> {
		return this.getSharedCapacityByDateRangeUseCase.handle(experienceId, query);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
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
		@CurrentUser() user: { userId: string; roles: AccountRole[] },
		@Param('experienceId') experienceId: string,
		@Body() body: PatchExcludedDatesDto,
	): Promise<ExperienceAvailabilityPatchResponse> {
		return this.updateExcludedDatesUseCase.handle(
			experienceId,
			body,
			user.userId,
			user.roles,
		);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
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
		@CurrentUser() user: { userId: string; roles: AccountRole[] },
		@Param('experienceId') experienceId: string,
		@Body() body: PatchAvailableDatesDto,
	): Promise<ExperienceAvailabilityPatchResponse> {
		return this.updateAvailableDatesUseCase.handle(
			experienceId,
			body,
			user.userId,
			user.roles,
		);
	}
}
