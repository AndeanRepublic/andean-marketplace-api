import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { SellerRepository } from '../../datastore/Seller.repo';
import { Seller } from '../../../domain/entities/Seller';
import { CreateSellerDto } from '../../../infra/controllers/dto/CreateSellerDto';
import { AccountRepository } from '../../datastore/Account.repo';
import { AccountType } from '../../../domain/enums/AccountType';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { Account } from '../../../domain/entities/Account';

@Injectable()
export class CreateSellerUseCase {
  constructor(
    @Inject(SellerRepository)
    private readonly sellerRepository: SellerRepository,
    @Inject(AccountRepository)
    private readonly accountRepository: AccountRepository,
  ) {}

  async handle(sellerDto: CreateSellerDto): Promise<Seller> {
    let foundSeller: Seller | null =
      await this.sellerRepository.getSellerByEmail(sellerDto.email);
    if (foundSeller) {
      throw new ConflictException('Email already in use');
    }
    foundSeller = await this.sellerRepository.getSellerByPhoneNumber(
      sellerDto.phoneNumber,
    );
    if (foundSeller) {
      throw new ConflictException('Phone number already in use');
    }

    const sellerToSave = new Seller(
      crypto.randomUUID(),
      sellerDto.typePerson,
      sellerDto.numberDocument,
      sellerDto.ruc ?? '',
      sellerDto.commercialName,
      sellerDto.address,
      sellerDto.phoneNumber,
      sellerDto.email,
    );
    await this.sellerRepository.saveSeller(sellerToSave);

    // Create account
    const accountToSave: Account = {
      userId: sellerToSave.id,
      password: sellerDto.password,
      type: AccountType.SELLER,
      status: AccountStatus.PENDING,
    };
    await this.accountRepository.saveAccount(accountToSave);
    return sellerToSave;
  }
}
