import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CreateCustomerDto } from '../../../infra/controllers/dto/CreateCustomerDto';
import { CustomerProfile } from '../../../domain/entities/CustomerProfile';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../../datastore/Account.repo';
import { Account } from '../../../domain/entities/Account';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { CustomerProfileMapper } from '../../../infra/services/CustomerProfileMapper';

@Injectable()
export class CreateCustomerUseCase {
	constructor(
		@Inject(CustomerProfileRepository)
		private readonly userRepository: CustomerProfileRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
	) {}

	async handle(userDto: CreateCustomerDto): Promise<CustomerProfile> {
		const accountFound: Account | null =
			await this.accountRepository.getAccountByEmail(userDto.email);
		if (accountFound) {
			throw new ConflictException('Email already in use');
		}
		const userId: string = crypto.randomUUID();
		// Create account
		const accountToSave: Account = {
			userId: userId,
			name: userDto.name,
			email: userDto.email,
			password: userDto.password,
			status: AccountStatus.ENABLED,
			roles: [AccountRole.USER],
		};
		await this.accountRepository.saveAccount(accountToSave);

		const customerToSave = CustomerProfileMapper.fromCreateDto(userId, userDto);
		await this.userRepository.saveCustomer(customerToSave);
		return customerToSave;
	}
}
