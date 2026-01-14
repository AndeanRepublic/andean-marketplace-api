import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductMapper } from 'src/andean/infra/services/textileProducts/TextileProductMapper';
import { CreateTextileProductDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileProductDto';

@Injectable()
export class UpdateTextileProductUseCase {
  constructor(
    @Inject(TextileProductRepository)
    private readonly textileProductRepository: TextileProductRepository,
  ) {}

  async handle(
    id: string,
    dto: CreateTextileProductDto,
  ): Promise<TextileProduct> {
    const productFound =
      await this.textileProductRepository.getTextileProductById(id);
    if (!productFound) {
      throw new NotFoundException('Textile product not found');
    }
    const toUpdate = TextileProductMapper.fromUpdateDto(id, dto);
    return this.textileProductRepository.updateTextileProduct(id, toUpdate);
  }
}
