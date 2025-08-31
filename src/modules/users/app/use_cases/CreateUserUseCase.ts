import { UserRepository } from '../datastore/User.repo';
import { CreateUserDto } from '../../infra/controllers/dto/CreateUserDto';
import { User } from '../../domain/entities/user';
import { Inject, Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async handle(userDto: CreateUserDto): Promise<User> {
    let foundUser: User | null = await this.userRepository.getUserByEmail(
      userDto.email,
    );
    if (foundUser) {
      throw new ConflictException('Email already in use');
    }
    foundUser = await this.userRepository.getUserByPhoneNumber(
      userDto.phoneNumber,
    );
    if (foundUser) {
      throw new ConflictException('Phone number already in use');
    }
    const userToSave = new User(
      crypto.randomUUID(),
      userDto.name,
      userDto.country,
      userDto.phoneNumber,
      userDto.email,
      userDto.language,
      userDto.coin,
    );
    await this.userRepository.saveUser(userToSave);
    return userToSave;
  }
}
