import { Injectable } from '@nestjs/common';
import { Seller } from '../../domain/entities/seller';
import { SellerRepository } from '../datastore/Seller.repo';

@Injectable()
export class GetAllSellersUseCase {
  constructor(private readonly sellerRepository: SellerRepository) {}

  async handle(): Promise<Seller[]> {
    return this.sellerRepository.getAllSellers();
  }
}
