import { Inject, Injectable } from '@nestjs/common';
import { SellerRepository } from '../datastore/Seller.repo';
import { Seller } from '../../domain/entities/seller';
import { CreateSellerDto } from '../../infra/controllers/dto/CreateSellerDto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class CreateSellerUseCase {
  constructor(
    @Inject(SellerRepository)
    private readonly sellerRepository: SellerRepository,
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
    return sellerToSave;
  }
}
