import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../app/use_cases/users/CreateCustomerUseCase';
import { GetAllCustomerUseCase } from '../../app/use_cases/users/GetAllCustomerUseCase';
import { CreateUserDto } from './dto/CreateUserDto';
import { Customer } from '../../domain/entities/Customer';
import { CreateSellerDto } from './dto/CreateSellerDto';
import { Seller } from '../../domain/entities/Seller';
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
  async getAllCustomers(): Promise<Customer[]> {
    return this.getAllCustomerUseCase.handle();
  }

  @Post(path_customers)
  async createCustomer(@Body() body: CreateUserDto): Promise<Customer> {
    return this.createCustomerUseCase.handle(body);
  }

  @Get(path_sellers)
  async getAllSellers(): Promise<Seller[]> {
    return this.getAllSellersUseCase.handle();
  }

  @Post(path_sellers)
  async createSeller(@Body() body: CreateSellerDto): Promise<Seller> {
    return this.createSellerUseCase.handle(body);
  }
}
