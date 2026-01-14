import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductDocument } from '../../persistence/textileProducts/textileProduct.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextileProductDto } from '../../controllers/dto/textileProducts/CreateTextileProductDto';
import { BaseInfo } from 'src/andean/domain/entities/textileProducts/BaseInfo';
import { PriceInventary } from 'src/andean/domain/entities/textileProducts/PriceInventary';
import { Atribute } from 'src/andean/domain/entities/textileProducts/Atribute';
import { PreparationTime } from 'src/andean/domain/entities/textileProducts/PreparationTime';

export class TextileProductMapper {
  static fromDocument(doc: TextileProductDocument): TextileProduct {
    const plain = doc.toObject();
    const { _id, ...rest } = plain;

    const baseInfo = plainToInstance(BaseInfo, rest.baseInfo);
    const priceInventary = plainToInstance(PriceInventary, rest.priceInventary);

    let atribute: Atribute | undefined;
    if (rest.atribute) {
      const preparationTime = plainToInstance(
        PreparationTime,
        rest.atribute.preparationTime,
      );
      atribute = plainToInstance(Atribute, {
        ...rest.atribute,
        preparationTime,
      });
    }

    return plainToInstance(TextileProduct, {
      ...rest,
      baseInfo,
      priceInventary,
      atribute,
    });
  }

  static fromCreateDto(dto: CreateTextileProductDto): TextileProduct {
    const { ...textileProductData } = dto;
    const baseInfo = plainToInstance(BaseInfo, dto.baseInfo);
    const priceInventary = plainToInstance(PriceInventary, dto.priceInventary);

    let atribute: Atribute | undefined;
    if (dto.atribute) {
      const preparationTime = plainToInstance(
        PreparationTime,
        dto.atribute.preparationTime,
      );
      atribute = plainToInstance(Atribute, {
        ...dto.atribute,
        preparationTime,
      });
    }

    const plain = {
      id: crypto.randomUUID(),
      ...textileProductData,
      baseInfo,
      priceInventary,
      atribute,
    };

    return plainToInstance(TextileProduct, plain);
  }

  static fromUpdateDto(
    id: string,
    dto: CreateTextileProductDto,
  ): TextileProduct {
    const { ...textileProductData } = dto;
    const baseInfo = plainToInstance(BaseInfo, dto.baseInfo);
    const priceInventary = plainToInstance(PriceInventary, dto.priceInventary);

    let atribute: Atribute | undefined;
    if (dto.atribute) {
      const preparationTime = plainToInstance(
        PreparationTime,
        dto.atribute.preparationTime,
      );
      atribute = plainToInstance(Atribute, {
        ...dto.atribute,
        preparationTime,
      });
    }

    const plain = {
      id: id,
      ...textileProductData,
      baseInfo,
      priceInventary,
      atribute,
    };

    return plainToInstance(TextileProduct, plain);
  }

  static toPersistence(textileProduct: TextileProduct) {
    const plain = instanceToPlain(textileProduct);
    const { _id, ...updateData } = plain;

    return {
      ...updateData,
    };
  }
}
