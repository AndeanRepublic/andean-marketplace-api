import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { GetAllCustomerUseCase } from '../../app/use_cases/users/GetAllCustomerUseCase';
import { GetAllSellersUseCase } from '../../app/use_cases/users/GetAllSellersUseCase';
import { UpdateAccountStatusUseCase } from '../../app/use_cases/users/UpdateAccountStatusUseCase';
import { UpdateAccountStatusDto } from './dto/UpdateAccountStatusDto';
import { RolesGuard } from '../core/roles.guard';
import { Roles } from '../core/roles.decorator';
import { AccountRole } from '../../domain/enums/AccountRole';
import { JwtAuthGuard } from '../core/jwtAuth.guard';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
export class AdminController {
	constructor(
		private readonly getAllCustomerUseCase: GetAllCustomerUseCase,
		private readonly getAllSellersUseCase: GetAllSellersUseCase,
		private readonly updateAccountStatusUseCase: UpdateAccountStatusUseCase,
	) {}

	// @Get('/customers')
	// async getAllCustomers(): Promise<CustomerProfile[]> {
	// 	return this.getAllCustomerUseCase.handle();
	// }

	// @Get('/sellers')
	// async getAllSellers(): Promise<SellerProfile[]> {
	// 	return this.getAllSellersUseCase.handle();
	// }

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Put('/account/:userId')
	@ApiOperation({
		summary: 'Actualizar estado de cuenta de usuario',
		description:
			'Solo accesible por administradores. Permite habilitar/deshabilitar cuentas de usuarios.',
	})
	@ApiResponse({ status: 200, description: 'Estado de cuenta actualizado' })
	@ApiResponse({ status: 401, description: 'No autorizado' })
	@ApiResponse({ status: 403, description: 'Se requiere rol de administrador' })
	async updateAccountStatus(
		@Param('userId') userId: string,
		@Body() body: UpdateAccountStatusDto,
	): Promise<void> {
		return this.updateAccountStatusUseCase.handle(userId, body);
	}
}
