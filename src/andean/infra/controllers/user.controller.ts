import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../app/use_cases/users/CreateCustomerUseCase';
import { GetAllCustomerUseCase } from '../../app/use_cases/users/GetAllCustomerUseCase';
import { CreateUserDto } from './dto/CreateUserDto';
import { CustomerProfile } from '../../domain/entities/CustomerProfile';
import { CreateSellerDto } from './dto/CreateSellerDto';
import { SellerProfile } from '../../domain/entities/SellerProfile';
import { GetAllSellersUseCase } from '../../app/use_cases/users/GetAllSellersUseCase';
import { CreateSellerUseCase } from '../../app/use_cases/users/CreateSellerUseCase';

const path_customers: string = '/customers';
const path_sellers: string = '/sellers';

@Controller('users')
export class UserController {
  constructor(
    private readonly getAllCustomerUseCase: GetAllCustomerUseCase,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getAllSellersUseCase: GetAllSellersUseCase,
    private readonly createSellerUseCase: CreateSellerUseCase,
  ) {}

  @Get(path_customers)
  async getAllCustomers(): Promise<CustomerProfile[]> {
    return this.getAllCustomerUseCase.handle();
  }

  @Post(path_customers)
  async createCustomer(@Body() body: CreateUserDto): Promise<CustomerProfile> {
    return this.createCustomerUseCase.handle(body);
  }

  @Get(path_sellers)
  async getAllSellers(): Promise<SellerProfile[]> {
    return this.getAllSellersUseCase.handle();
  }

  @Post(path_sellers)
  async createSeller(@Body() body: CreateSellerDto): Promise<SellerProfile> {
    return this.createSellerUseCase.handle(body);
  }
}
