import { UserRepository } from '../datastore/User.repo';
import { CreateUserDto } from '../../infra/controllers/dto/CreateUserDto';
import { User } from '../../domain/entities/user';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async handle(userDto: CreateUserDto): Promise<User> {
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
