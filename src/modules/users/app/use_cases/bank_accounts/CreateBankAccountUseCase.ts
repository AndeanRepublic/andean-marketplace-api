import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SellerRepository } from '../../datastore/Seller.repo';
import { SellerBankAccountRepository } from '../../datastore/SellerBankAccount.repo';
import { CreateBankAccountDto } from '../../../infra/controllers/dto/CreateBankAccountDto';
import { SellerBankAccount } from '../../../domain/entities/SellerBankAccount';
import { BankAccountStatus } from '../../../domain/enums/BankAccountStatus';
import { BankAccountType } from '../../../domain/enums/BankAccountType';

@Injectable()
export class CreateBankAccountUseCase {
  constructor(
    @Inject(SellerRepository)
    private readonly sellerRepository: SellerRepository,
    @Inject(SellerBankAccountRepository)
    private readonly sellerBankAccountRepository: SellerBankAccountRepository,
  ) {}

  async handle(
    bankAccountDto: CreateBankAccountDto,
  ): Promise<SellerBankAccount> {
    const sellerFound = await this.sellerRepository.getSellerById(
      bankAccountDto.sellerId,
    );
    if (!sellerFound) {
      throw new NotFoundException('Seller not found');
    }
    const accountToSave = new SellerBankAccount(
      crypto.randomUUID(),
      bankAccountDto.sellerId,
      BankAccountStatus.ENABLED,
      BankAccountType[bankAccountDto.type as keyof typeof BankAccountType],
      bankAccountDto.cci,
      bankAccountDto.bank,
    );
    return this.sellerBankAccountRepository.saveBankAccount(accountToSave);
  }
}