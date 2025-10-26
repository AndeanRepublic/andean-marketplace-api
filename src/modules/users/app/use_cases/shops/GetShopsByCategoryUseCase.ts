import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { Shop } from '../../../domain/entities/Shop';

@Injectable()
export class GetShopsByCategoryUseCase {
  constructor(private readonly shopRepository: ShopRepository) {}

  async handle(category: string): Promise<Shop[]> {
    return this.shopRepository.getAllByCategory(category);
  }
}
