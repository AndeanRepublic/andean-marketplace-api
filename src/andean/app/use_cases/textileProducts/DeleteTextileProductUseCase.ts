import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';

@Injectable()
export class DeleteTextileProductUseCase {
  constructor(
    @Inject(TextileProductRepository)
    private readonly textileProductRepository: TextileProductRepository,
  ) {}

  async handle(id: string): Promise<void> {
    const productFound =
      await this.textileProductRepository.getTextileProductById(id);
    if (!productFound) {
      throw new NotFoundException('Textile product not found');
    }
    await this.textileProductRepository.deleteTextileProduct(id);
    return;
  }
}
