import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { Shop } from '../../../domain/entities/Shop';

@Injectable()
export class GetShopsBySellerIdUseCase {
  constructor(private readonly shopRepository: ShopRepository) {}

  async handle(sellerId: string): Promise<Shop[]> {
    return this.shopRepository.getAllBySellerId(sellerId);
  }
}
