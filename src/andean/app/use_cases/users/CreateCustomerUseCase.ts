import { UserRepository } from '../../datastore/Customer.repo';
import { CreateUserDto } from '../../../infra/controllers/dto/CreateUserDto';
import { Customer } from '../../../domain/entities/Customer';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../../datastore/Account.repo';
import { Account } from '../../../domain/entities/Account';
import { AccountType } from '../../../domain/enums/AccountType';
import { AccountStatus } from '../../../domain/enums/AccountStatus';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(AccountRepository)
    private readonly accountRepository: AccountRepository,
  ) {}

  async handle(userDto: CreateUserDto): Promise<Customer> {
    let foundUser: Customer | null = await this.userRepository.getCustomerByEmail(
      userDto.email,
    );
    if (foundUser) {
      throw new ConflictException('Email already in use');
    }
    foundUser = await this.userRepository.getCustomerByPhoneNumber(
      userDto.phoneNumber,
    );
    if (foundUser) {
      throw new ConflictException('Phone number already in use');
    }
    const customerToSave = new Customer(
      crypto.randomUUID(),
      userDto.name,
      userDto.country,
      userDto.phoneNumber,
      userDto.email,
      userDto.language,
      userDto.coin,
    );
    await this.userRepository.saveCustomer(customerToSave);

    // Create account
    const accountToSave: Account = {
      userId: customerToSave.id,
      password: userDto.password,
      type: AccountType.USER,
      status: AccountStatus.ENABLED,
    };
    await this.accountRepository.saveAccount(accountToSave);
    return customerToSave;
  }
}
