import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user';
import { UserRepository } from '../datastore/User.repo';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }
}
