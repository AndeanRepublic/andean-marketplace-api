import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../core/jwtAuth.guard';
import { RolesGuard } from '../core/roles.guard';
import { Roles } from '../core/roles.decorator';
import { CurrentUser } from '../core/current-user.decorator';
import { AccountRole } from '../../domain/enums/AccountRole';
import { GetSellerWorkspaceUseCase } from '../../app/use_cases/sellers/GetSellerWorkspaceUseCase';
import { SellerWorkspaceResponse } from '../../app/models/users/SellerWorkspaceResponse';

@ApiTags('sellers')
@ApiBearerAuth('JWT-auth')
@Controller('sellers')
export class SellerController {
	constructor(
		private readonly getSellerWorkspaceUseCase: GetSellerWorkspaceUseCase,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.SELLER)
	@Get('me/workspace')
	@ApiOperation({
		summary: 'Workspace del vendedor autenticado',
		description:
			'Tiendas, comunidades vinculadas y catálogos (superfoods / textiles / experiencias) que el vendedor puede gestionar.',
	})
	@ApiResponse({ status: 200, type: SellerWorkspaceResponse })
	@ApiResponse({ status: 403, description: 'No es vendedor o no tiene perfil' })
	async getWorkspace(
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
	): Promise<SellerWorkspaceResponse> {
		return this.getSellerWorkspaceUseCase.handle(requestingUser.userId);
	}
}
