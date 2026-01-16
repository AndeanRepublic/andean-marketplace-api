import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';

@Injectable()
export class GetAllTextileProductsUseCase {
  constructor(
    @Inject(TextileProductRepository)
    private readonly textileProductRepository: TextileProductRepository,
  ) {}

  async handle(): Promise<TextileProduct[]> {
    const products =
      await this.textileProductRepository.getAllTextileProducts();
    if (products.length === 0) {
      throw new NotFoundException('No textile products found');
    }
    return products;
  }
}
