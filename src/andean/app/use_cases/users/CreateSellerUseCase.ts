import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { SellerProfile } from '../../../domain/entities/SellerProfile';
import { CreateSellerDto } from '../../../infra/controllers/dto/CreateSellerDto';
import { AccountRepository } from '../../datastore/Account.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { Account } from '../../../domain/entities/Account';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';

@Injectable()
export class CreateSellerUseCase {
  constructor(
    @Inject(SellerProfileRepository)
    private readonly sellerRepository: SellerProfileRepository,
    @Inject(AccountRepository)
    private readonly accountRepository: AccountRepository,
  ) {}

  async handle(sellerDto: CreateSellerDto): Promise<SellerProfile> {
    const accountFound: Account | null =
      await this.accountRepository.getAccountByEmail(sellerDto.email);
    if (accountFound) {
      throw new ConflictException('Email already in use');
    }
    // Create account
    const userId: string = crypto.randomUUID();
    const accountToSave: Account = {
      userId: userId,
      name: sellerDto.name,
      email: sellerDto.email,
      password: sellerDto.password,
      status: AccountStatus.PENDING,
      roles: [AccountRole.SELLER],
    };
    await this.accountRepository.saveAccount(accountToSave);

    const sellerToSave = SellerProfileMapper.fromCreateDto(userId, sellerDto);
    await this.sellerRepository.saveSeller(sellerToSave);
    return sellerToSave;
  }
}
