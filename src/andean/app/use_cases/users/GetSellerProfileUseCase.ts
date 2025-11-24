import { Injectable } from '@nestjs/common';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { SellerProfile } from '../../../domain/entities/SellerProfile';

@Injectable()
export class GetSellerProfileUseCase {
  constructor(private readonly sellerRepository: SellerProfileRepository) {}

  async handle(userId: string): Promise<SellerProfile | null> {
    return this.sellerRepository.getSellerByUserId(userId);
  }
}
