import { Body, Controller, Post, Get, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
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
	) { }

	@Get(path_customers)
	@ApiOperation({ summary: 'Obtener todos los clientes' })
	@ApiResponse({ status: 200, description: 'Lista de todos los clientes registrados' })
	async getAllCustomers(): Promise<CustomerProfile[]> {
		return this.getAllCustomerUseCase.handle();
	}

	@Get(path_customer_profile)
	async getCustomerProfile(
		@Param('userId') userId: string,
	): Promise<CustomerProfile | null> {
		return this.getCustomerProfileUseCase.handle(userId);
	}

	@Get(path_seller_profile)
	async getSellerProfile(
		@Param('userId') userId: string,
	): Promise<SellerProfile | null> {
		return this.getSellerProfileUseCase.handle(userId);
	}

	@Put(path_customer_profile)
	async updateCustomerProfile(
		@Param('userId') userId: string,
		@Body() body: UpdateCustomerProfileDto,
	): Promise<void> {
		return this.updateCustomerProfileUseCase.handle(userId, body);
	}

	@Put(path_seller_profile)
	async updateSellerProfile(
		@Param('userId') userId: string,
		@Body() body: UpdateSellerProfileDto,
	): Promise<void> {
		return this.updateSellerProfileUseCase.handle(userId, body);
	}

	@Post(path_customers)
	@ApiOperation({ summary: 'Crear un nuevo cliente', description: 'Registra un nuevo cliente en el marketplace' })
	@ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	@ApiResponse({ status: 409, description: 'El email ya está registrado' })
	async createCustomer(
		@Body() body: CreateCustomerDto,
	): Promise<CustomerProfile> {
		return this.createCustomerUseCase.handle(body);
	}

	@Get(path_sellers)
	async getAllSellers(): Promise<SellerProfile[]> {
		return this.getAllSellersUseCase.handle();
	}

	@Post(path_sellers)
	@ApiOperation({ summary: 'Crear un nuevo vendedor', description: 'Registra un nuevo vendedor en el marketplace' })
	@ApiResponse({ status: 201, description: 'Vendedor creado exitosamente' })
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	@ApiResponse({ status: 409, description: 'El email ya está registrado' })
	async createSeller(@Body() body: CreateSellerDto): Promise<SellerProfile> {
		return this.createSellerUseCase.handle(body);
	}
}
