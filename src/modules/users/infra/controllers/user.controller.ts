import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateUserUseCase } from '../../app/use_cases/CreateUserUseCase';
import { GetAllUsersUseCase } from '../../app/use_cases/GetAllUsersUseCase';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from '../../domain/entities/user';
import { CreateSellerDto } from './dto/CreateSellerDto';
import { Seller } from '../../domain/entities/seller';
import { GetAllSellersUseCase } from '../../app/use_cases/GetAllSellersUseCase';
import { CreateSellerUseCase } from '../../app/use_cases/CreateSellerUseCase';

const path_buyer_users: string = '/buyer';
const path_seller_users: string = '/seller';

@Controller('users')
export class UserController {
  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllSellersUseCase: GetAllSellersUseCase,
    private readonly createSellerUseCase: CreateSellerUseCase,
  ) {}

  @Get(path_buyer_users)
  async getAllBuyerUsers(): Promise<User[]> {
    return this.getAllUsersUseCase.handle();
  }

  @Post(path_buyer_users)
  async createBuyerUser(@Body() body: CreateUserDto): Promise<User> {
    return this.createUserUseCase.handle(body);
  }

  @Get(path_seller_users)
  async getAllSellerUsers(): Promise<Seller[]> {
    return this.getAllSellersUseCase.handle();
  }

  @Post(path_seller_users)
  async createSellerUser(@Body() body: CreateSellerDto): Promise<Seller> {
    return this.createSellerUseCase.handle(body);
  }
}
