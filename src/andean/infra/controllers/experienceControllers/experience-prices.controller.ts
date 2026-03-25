import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
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
import { AccountRole } from '../../../domain/enums/AccountRole';
import { UpdatePriceByAgeGroupUseCase } from 'src/andean/app/use_cases/experiences/prices/UpdatePriceByAgeGroupUseCase';
import { PatchAgeGroupPriceDto } from '../dto/experiences/PatchExperiencePricesDto';
import { ExperiencePricesPatchResponse } from 'src/andean/app/models/experiences/ExperiencePatchResponse';

@ApiTags('Experiences — Prices')
@Controller('experiences/:experienceId/prices')
export class ExperiencePricesController {
	constructor(
		private readonly updatePriceByAgeGroupUseCase: UpdatePriceByAgeGroupUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER, AccountRole.ADMIN)
	@Patch('age-group')
	@ApiOperation({
		summary: 'Actualizar precio de un grupo de edad',
		description:
			'Actualiza el precio de un grupo de edad específico (ADULTS, CHILDREN, etc.) sin tocar el resto de los grupos. Identifica el grupo por su code.',
	})
	@ApiParam({
		name: 'experienceId',
		description: 'ID único de la experiencia',
		example: '507f1f77bcf86cd799439011',
	})
	@ApiBody({ type: PatchAgeGroupPriceDto })
	@ApiResponse({
		status: 200,
		description: 'Precio del grupo de edad actualizado exitosamente',
		type: ExperiencePricesPatchResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'El code del grupo de edad no existe en esta experiencia',
	})
	@ApiResponse({
		status: 404,
		description: 'Experiencia o precios no encontrados',
	})
	async updateAgeGroupPrice(
		@CurrentUser() user: { userId: string; roles: AccountRole[] },
		@Param('experienceId') experienceId: string,
		@Body() body: PatchAgeGroupPriceDto,
	): Promise<ExperiencePricesPatchResponse> {
		return this.updatePriceByAgeGroupUseCase.handle(
			experienceId,
			body,
			user.userId,
			user.roles,
		);
	}
}
