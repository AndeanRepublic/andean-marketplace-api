import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileStyleRepository } from '../../datastore/textileProducts/TextileStyle.repo';
import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';

@Injectable()
export class GetAllTextileStylesUseCase {
  constructor(
    @Inject(TextileStyleRepository)
    private readonly textileStyleRepository: TextileStyleRepository,
  ) {}

  async handle(): Promise<TextileStyle[]> {
    const styles = await this.textileStyleRepository.getAllTextileStyles();
    if (styles.length === 0) {
      throw new NotFoundException('No styles found');
    }
    return styles;
  }
}
