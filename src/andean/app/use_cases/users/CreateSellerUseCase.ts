import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { SellerProfile } from '../../../domain/entities/SellerProfile';
import { CreateSellerDto } from '../../../infra/controllers/dto/CreateSellerDto';
import { AccountRepository } from '../../datastore/Account.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { Account } from '../../../domain/entities/Account';

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
    const sellerToSave = new SellerProfile(
      crypto.randomUUID(),
      sellerDto.typePerson,
      sellerDto.numberDocument,
      sellerDto.ruc ?? '',
      sellerDto.commercialName,
      sellerDto.address,
      sellerDto.phoneNumber,
    );
    await this.sellerRepository.saveSeller(sellerToSave);

    // Create account
    const accountToSave: Account = {
      userId: sellerToSave.id,
      name: sellerDto.name,
      email: sellerDto.email,
      password: sellerDto.password,
      type: AccountRole.SELLER,
      status: AccountStatus.PENDING,
    };
    await this.accountRepository.saveAccount(accountToSave);
    return sellerToSave;
  }
}
