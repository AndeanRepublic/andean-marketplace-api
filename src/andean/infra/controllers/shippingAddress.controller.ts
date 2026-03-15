import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	HttpCode,
	HttpStatus,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../core/jwtAuth.guard';
import { CurrentUser } from '../core/current-user.decorator';
import { AccountRole } from '../../domain/enums/AccountRole';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger';
import { CreateShippingAddressUseCase } from '../../app/use_cases/shipping/CreateShippingAddressUseCase';
import { GetShippingAddressesByCustomerUseCase } from '../../app/use_cases/shipping/GetShippingAddressesByCustomerUseCase';
import { UpdateShippingAddressUseCase } from '../../app/use_cases/shipping/UpdateShippingAddressUseCase';
import { DeleteShippingAddressUseCase } from '../../app/use_cases/shipping/DeleteShippingAddressUseCase';
import { SetDefaultShippingAddressUseCase } from '../../app/use_cases/shipping/SetDefaultShippingAddressUseCase';
import { GetShippingAddressByIdUseCase } from '../../app/use_cases/shipping/GetShippingAddressByIdUseCase';
import { CreateShippingAddressDto } from './dto/CreateShippingAddressDto';
import { UpdateShippingAddressDto } from './dto/UpdateShippingAddressDto';
import { ShippingAddress } from '../../domain/entities/ShippingAddress';

@ApiTags('shipping-addresses')
@Controller('shipping-addresses')
export class ShippingAddressController {
	constructor(
		private readonly createShippingAddressUseCase: CreateShippingAddressUseCase,
		private readonly getShippingAddressesByCustomerUseCase: GetShippingAddressesByCustomerUseCase,
		private readonly updateShippingAddressUseCase: UpdateShippingAddressUseCase,
		private readonly deleteShippingAddressUseCase: DeleteShippingAddressUseCase,
		private readonly setDefaultShippingAddressUseCase: SetDefaultShippingAddressUseCase,
		private readonly getShippingAddressByIdUseCase: GetShippingAddressByIdUseCase,
	) {}

	@UseGuards(JwtAuthGuard)
	@Post('/customer/:customerId')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear dirección de envío',
		description: 'Crea una nueva dirección de envío para un cliente',
	})
	@ApiParam({
		name: 'customerId',
		description: 'ID del cliente',
		type: String,
	})
	@ApiBody({ type: CreateShippingAddressDto })
	@ApiResponse({
		status: 201,
		description: 'Dirección de envío creada exitosamente',
		type: ShippingAddress,
	})
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	@ApiResponse({ status: 404, description: 'Cliente no encontrado' })
	async create(
		@Param('customerId') customerId: string,
		@Body() body: CreateShippingAddressDto,
	): Promise<ShippingAddress> {
		return this.createShippingAddressUseCase.handle(customerId, body);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/customer/:customerId')
	@ApiOperation({
		summary: 'Obtener direcciones de envío por cliente',
		description: 'Recupera todas las direcciones de envío de un cliente',
	})
	@ApiParam({
		name: 'customerId',
		description: 'ID del cliente',
		type: String,
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de direcciones de envío',
		type: [ShippingAddress],
	})
	@ApiResponse({ status: 404, description: 'Cliente no encontrado' })
	async getByCustomerId(
		@Param('customerId') customerId: string,
	): Promise<ShippingAddress[]> {
		return this.getShippingAddressesByCustomerUseCase.handle(customerId);
	}

	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener dirección de envío por ID',
		description: 'Recupera una dirección de envío específica por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la dirección de envío',
		type: String,
	})
	@ApiResponse({
		status: 200,
		description: 'Dirección de envío encontrada',
		type: ShippingAddress,
	})
	@ApiResponse({ status: 404, description: 'Dirección de envío no encontrada' })
	async getById(@Param('id') id: string): Promise<ShippingAddress> {
		return this.getShippingAddressByIdUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard)
	@Put('/:id')
	@ApiOperation({
		summary: 'Actualizar dirección de envío',
		description: 'Actualiza una dirección de envío existente',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la dirección de envío',
		type: String,
	})
	@ApiBody({ type: UpdateShippingAddressDto })
	@ApiResponse({
		status: 200,
		description: 'Dirección de envío actualizada exitosamente',
		type: ShippingAddress,
	})
	@ApiResponse({
		status: 403,
		description: 'No autorizado para modificar esta dirección',
	})
	@ApiResponse({ status: 404, description: 'Dirección de envío no encontrada' })
	async update(
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
		@Param('id') id: string,
		@Body() body: UpdateShippingAddressDto,
	): Promise<ShippingAddress> {
		return this.updateShippingAddressUseCase.handle(
			id,
			requestingUser.userId,
			requestingUser.roles,
			body,
		);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar dirección de envío',
		description: 'Elimina una dirección de envío',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la dirección de envío',
		type: String,
	})
	@ApiResponse({
		status: 204,
		description: 'Dirección de envío eliminada exitosamente',
	})
	@ApiResponse({
		status: 403,
		description: 'No autorizado para eliminar esta dirección',
	})
	@ApiResponse({ status: 404, description: 'Dirección de envío no encontrada' })
	async delete(
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
		@Param('id') id: string,
	): Promise<void> {
		return this.deleteShippingAddressUseCase.handle(
			id,
			requestingUser.userId,
			requestingUser.roles,
		);
	}

	@Put('/:id/set-default')
	@ApiOperation({
		summary: 'Marcar dirección como predeterminada',
		description:
			'Marca una dirección de envío como predeterminada para el cliente',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la dirección de envío',
		type: String,
	})
	@ApiResponse({
		status: 200,
		description: 'Dirección marcada como predeterminada exitosamente',
		type: ShippingAddress,
	})
	@ApiResponse({ status: 404, description: 'Dirección de envío no encontrada' })
	async setDefault(@Param('id') id: string): Promise<ShippingAddress> {
		return this.setDefaultShippingAddressUseCase.handle(id);
	}
}
