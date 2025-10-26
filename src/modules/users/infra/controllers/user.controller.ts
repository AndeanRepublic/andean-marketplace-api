import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../app/use_cases/users/CreateCustomerUseCase';
import { GetAllCustomerUseCase } from '../../app/use_cases/users/GetAllCustomerUseCase';
import { CreateUserDto } from './dto/CreateUserDto';
import { Customer } from '../../domain/entities/Customer';
import { CreateSellerDto } from './dto/CreateSellerDto';
import { Seller } from '../../domain/entities/Seller';
import { GetAllSellersUseCase } from '../../app/use_cases/users/GetAllSellersUseCase';
import { CreateSellerUseCase } from '../../app/use_cases/users/CreateSellerUseCase';

const path_buyer_users: string = '/customers';
const path_seller_users: string = '/sellers';

@Controller('users')
export class UserController {
  constructor(
    private readonly getAllCustomerUseCase: GetAllCustomerUseCase,
    private readonly createUserUseCase: CreateCustomerUseCase,
    private readonly getAllSellersUseCase: GetAllSellersUseCase,
    private readonly createSellerUseCase: CreateSellerUseCase,
  ) {}

  @Get(path_buyer_users)
  async getAllCustomers(): Promise<Customer[]> {
    return this.getAllCustomerUseCase.handle();
  }

  @Post(path_buyer_users)
  async createCustomer(@Body() body: CreateUserDto): Promise<Customer> {
    return this.createUserUseCase.handle(body);
  }

  @Get(path_seller_users)
  async getAllSellers(): Promise<Seller[]> {
    return this.getAllSellersUseCase.handle();
  }

  @Post(path_seller_users)
  async createSeller(@Body() body: CreateSellerDto): Promise<Seller> {
    return this.createSellerUseCase.handle(body);
  }
}
