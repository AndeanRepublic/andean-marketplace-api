import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateUserUseCase } from '../../app/use_cases/CreateUserUseCase';
import { CreateUserDto } from './dto/CreateUserDto';
import { UserRepository } from '../../app/datastore/User.repo';
import { User } from '../../domain/entities/user';

@Controller('users')
export class UserController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }
  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    return this.createUserUseCase.handle(body);
  }
}
