import { UserRepository } from '../datastore/User.repo';
import { CreateUserDto } from '../../infra/controllers/dto/CreateUserDto';
import { User } from '../../domain/entities/user';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../datastore/Account.repo';
import { Account } from '../../domain/entities/Account';
import { AccountType } from '../../domain/enums/AccountType';
import { AccountStatus } from '../../domain/enums/AccountStatus';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(AccountRepository)
    private readonly accountRepository: AccountRepository,
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

    // Create account
    const accountToSave: Account = {
      userId: userToSave.id,
      password: userDto.password,
      type: AccountType.USER,
      status: AccountStatus.ENABLED,
    };
    await this.accountRepository.saveAccount(accountToSave);
    return userToSave;
  }
}
