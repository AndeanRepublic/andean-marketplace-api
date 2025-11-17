import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CreateUserDto } from '../../../infra/controllers/dto/CreateUserDto';
import { CustomerProfile } from '../../../domain/entities/CustomerProfile';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../../datastore/Account.repo';
import { Account } from '../../../domain/entities/Account';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { AccountStatus } from '../../../domain/enums/AccountStatus';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CustomerProfileRepository)
    private readonly userRepository: CustomerProfileRepository,
    @Inject(AccountRepository)
    private readonly accountRepository: AccountRepository,
  ) {}

  async handle(userDto: CreateUserDto): Promise<CustomerProfile> {
    const accountFound: Account | null =
      await this.accountRepository.getAccountByEmail(userDto.email);
    if (accountFound) {
      throw new ConflictException('Email already in use');
    }
    const customerToSave = new CustomerProfile(
      crypto.randomUUID(),
      userDto.name,
      userDto.country,
      userDto.phoneNumber,
      userDto.language,
      userDto.coin,
    );
    await this.userRepository.saveCustomer(customerToSave);

    // Create account
    const accountToSave: Account = {
      userId: customerToSave.id,
      password: userDto.password,
      name: userDto.name,
      email: userDto.email,
      type: AccountRole.USER,
      status: AccountStatus.ENABLED,
    };
    await this.accountRepository.saveAccount(accountToSave);
    return customerToSave;
  }
}
