import { Body, Controller, Post, Get, Param, Put } from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateCustomerUseCase } from '../../app/use_cases/users/CreateCustomerUseCase';
import { GetAllCustomerUseCase } from '../../app/use_cases/users/GetAllCustomerUseCase';
import { CreateCustomerDto } from './dto/CreateCustomerDto';
import { CustomerProfile } from '../../domain/entities/CustomerProfile';
import { CreateSellerDto } from './dto/CreateSellerDto';
import { SellerProfile } from '../../domain/entities/SellerProfile';
import { GetAllSellersUseCase } from '../../app/use_cases/users/GetAllSellersUseCase';
import { CreateSellerUseCase } from '../../app/use_cases/users/CreateSellerUseCase';
import { GetCustomerProfileUseCase } from '../../app/use_cases/users/GetCustomerProfileUseCase';
import { GetSellerProfileUseCase } from '../../app/use_cases/users/GetSellerProfileUseCase';
import { UpdateCustomerProfileUseCase } from '../../app/use_cases/users/UpdateCustomerProfileUseCase';
import { UpdateCustomerProfileDto } from './dto/UpdateCustomerProfileDto';
import { UpdateSellerProfileDto } from './dto/UpdateSellerProfileDto';
import { UpdateSellerProfileUseCase } from '../../app/use_cases/users/UpdateSellerProfileUseCase';
import { CustomerProfileResponse } from '../../app/modules/users/CustomerProfileResponse';
import { SellerProfileResponse } from '../../app/modules/users/SellerProfileResponse';

const path_customers: string = '/customers';
const path_sellers: string = '/sellers';
const path_customer_profile: string = path_customers + '/:userId/profile';
const path_seller_profile: string = path_sellers + '/:userId/profile';

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(
		private readonly getAllCustomerUseCase: GetAllCustomerUseCase,
		private readonly createCustomerUseCase: CreateCustomerUseCase,
		private readonly getAllSellersUseCase: GetAllSellersUseCase,
		private readonly createSellerUseCase: CreateSellerUseCase,
		private readonly getCustomerProfileUseCase: GetCustomerProfileUseCase,
		private readonly getSellerProfileUseCase: GetSellerProfileUseCase,
		private readonly updateCustomerProfileUseCase: UpdateCustomerProfileUseCase,
		private readonly updateSellerProfileUseCase: UpdateSellerProfileUseCase,
	) {}

	// @Get(path_customers)
	// @ApiOperation({ summary: 'Obtener todos los clientes' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Lista de todos los clientes registrados',
	// 	type: [CustomerProfileResponse],
	// })
	// async getAllCustomers(): Promise<CustomerProfile[]> {
	// 	return this.getAllCustomerUseCase.handle();
	// }

	// @Get(path_customer_profile)
	// @ApiOperation({ summary: 'Obtener perfil de un cliente' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Perfil del cliente obtenido exitosamente',
	// 	type: CustomerProfileResponse,
	// })
	// @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
	// @ApiParam({ name: 'userId', description: 'ID del usuario' })
	// async getCustomerProfile(
	// 	@Param('userId') userId: string,
	// ): Promise<CustomerProfile | null> {
	// 	return this.getCustomerProfileUseCase.handle(userId);
	// }

	// @Get(path_seller_profile)
	// @ApiOperation({ summary: 'Obtener perfil de un vendedor' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Perfil del vendedor obtenido exitosamente',
	// 	type: SellerProfileResponse,
	// })
	// @ApiResponse({ status: 404, description: 'Vendedor no encontrado' })
	// @ApiParam({ name: 'userId', description: 'ID del usuario' })
	// async getSellerProfile(
	// 	@Param('userId') userId: string,
	// ): Promise<SellerProfile | null> {
	// 	return this.getSellerProfileUseCase.handle(userId);
	// }

	@Put(path_customer_profile)
	@ApiOperation({
		summary: 'Actualizar perfil de cliente',
		description: 'Actualiza la información del perfil de un cliente existente',
	})
	@ApiParam({ name: 'userId', description: 'ID del usuario', type: String })
	@ApiBody({ type: UpdateCustomerProfileDto })
	@ApiResponse({
		status: 200,
		description: 'Perfil del cliente actualizado exitosamente',
	})
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	@ApiResponse({ status: 404, description: 'Cliente no encontrado' })
	async updateCustomerProfile(
		@Param('userId') userId: string,
		@Body() body: UpdateCustomerProfileDto,
	): Promise<void> {
		return this.updateCustomerProfileUseCase.handle(userId, body);
	}

	@Put(path_seller_profile)
	@ApiOperation({
		summary: 'Actualizar perfil de vendedor',
		description: 'Actualiza la información del perfil de un vendedor existente',
	})
	@ApiParam({ name: 'userId', description: 'ID del usuario', type: String })
	@ApiBody({ type: UpdateSellerProfileDto })
	@ApiResponse({
		status: 200,
		description: 'Perfil del vendedor actualizado exitosamente',
	})
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	@ApiResponse({ status: 404, description: 'Vendedor no encontrado' })
	async updateSellerProfile(
		@Param('userId') userId: string,
		@Body() body: UpdateSellerProfileDto,
	): Promise<void> {
		return this.updateSellerProfileUseCase.handle(userId, body);
	}

	@Post(path_customers)
	@ApiOperation({
		summary: 'Crear un nuevo cliente',
		description: 'Registra un nuevo cliente en el marketplace',
	})
	@ApiResponse({
		status: 201,
		description: 'Cliente creado exitosamente',
		type: CustomerProfileResponse,
	})
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	@ApiResponse({ status: 409, description: 'El email ya está registrado' })
	async createCustomer(
		@Body() body: CreateCustomerDto,
	): Promise<CustomerProfile> {
		return this.createCustomerUseCase.handle(body);
	}

	// @Get(path_sellers)
	// @ApiOperation({ summary: 'Obtener todos los vendedores' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Lista de todos los vendedores registrados',
	// 	type: [SellerProfileResponse],
	// })
	// async getAllSellers(): Promise<SellerProfile[]> {
	// 	return this.getAllSellersUseCase.handle();
	// }

	@Post(path_sellers)
	@ApiOperation({
		summary: 'Crear un nuevo vendedor',
		description:
			'Registra un nuevo vendedor en el marketplace. Puede proporcionar userId para agregar rol de vendedor a usuario existente, o email/password para crear nueva cuenta.',
	})
	@ApiResponse({
		status: 201,
		description: 'Vendedor creado exitosamente',
		type: SellerProfileResponse,
	})
	@ApiResponse({
		status: 400,
		description:
			'Datos de entrada inválidos o faltan email/password sin userId',
	})
	@ApiResponse({
		status: 409,
		description: 'Usuario no encontrado (cuando se proporciona userId)',
	})
	async createSeller(@Body() body: CreateSellerDto): Promise<SellerProfile> {
		return this.createSellerUseCase.handle(body);
	}
}
