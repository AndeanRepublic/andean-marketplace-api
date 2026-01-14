import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { CreateTextileProductDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileProductDto';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductMapper } from 'src/andean/infra/services/textileProducts/TextileProductMapper';

@Injectable()
export class CreateTextileProductUseCase {
  constructor(
    @Inject(TextileProductRepository)
    private readonly textileProductRepository: TextileProductRepository,
  ) {}

  async handle(dto: CreateTextileProductDto): Promise<TextileProduct> {
    const textileProductToSave = TextileProductMapper.fromCreateDto(dto);
    return this.textileProductRepository.saveTextileProduct(
      textileProductToSave,
    );
  }
}
