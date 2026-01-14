import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductDocument } from '../../persistence/textileProducts/textileProduct.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextileProductDto } from '../../controllers/dto/textileProducts/CreateTextileProductDto';
import { BaseInfo } from 'src/andean/domain/entities/textileProducts/BaseInfo';
import { PriceInventary } from 'src/andean/domain/entities/textileProducts/PriceInventary';
import { Atribute } from 'src/andean/domain/entities/textileProducts/Atribute';
import { PreparationTime } from 'src/andean/domain/entities/textileProducts/PreparationTime';
import { DetailTraceability } from 'src/andean/domain/entities/textileProducts/DetailTraceability';
import { TextileOptions } from 'src/andean/domain/entities/textileProducts/TextileOptions';
import { TextileOptionsItem } from 'src/andean/domain/entities/textileProducts/TextileOptionsItem';
import { TextileVariant } from 'src/andean/domain/entities/textileProducts/TextileVariant';
import { ProductTraceability } from 'src/andean/domain/entities/ProductTraceability';
import * as crypto from 'crypto';

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

    const detailTraceability = plainToInstance(
      DetailTraceability,
      rest.detailTraceability,
    );

    let productTraceability: ProductTraceability | null = null;
    if (rest.productTraceability) {
      productTraceability = plainToInstance(
        ProductTraceability,
        rest.productTraceability,
      );
    }

    const options = (rest.options || []).map((opt: any) => {
      const values = (opt.values || []).map((item: any) =>
        plainToInstance(TextileOptionsItem, item),
      );
      return plainToInstance(TextileOptions, { ...opt, values });
    });

    const variants = (rest.variants || []).map((variant: any) =>
      plainToInstance(TextileVariant, variant),
    );

    return plainToInstance(TextileProduct, {
      ...rest,
      baseInfo,
      priceInventary,
      atribute,
      detailTraceability,
      productTraceability,
      options,
      variants,
      createdAt: rest.createdAt || new Date(),
      updatedAt: rest.updatedAt || new Date(),
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

    const detailTraceability = plainToInstance(
      DetailTraceability,
      dto.detailTraceability,
    );

    let productTraceability: ProductTraceability | null = null;
    if (dto.productTraceability) {
      productTraceability = plainToInstance(
        ProductTraceability,
        dto.productTraceability,
      );
    }

    const options = (dto.options || []).map((opt) => {
      const values = (opt.values || []).map((item) =>
        plainToInstance(TextileOptionsItem, {
          ...item,
          id: crypto.randomUUID(),
        }),
      );
      return plainToInstance(TextileOptions, {
        ...opt,
        id: crypto.randomUUID(),
        values,
      });
    });

    const variants = (dto.variants || []).map((variant) =>
      plainToInstance(TextileVariant, { ...variant, id: crypto.randomUUID() }),
    );

    const plain = {
      id: crypto.randomUUID(),
      ...textileProductData,
      baseInfo,
      priceInventary,
      atribute,
      detailTraceability,
      productTraceability,
      options,
      variants,
      createdAt: new Date(),
      updatedAt: new Date(),
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

    const detailTraceability = plainToInstance(
      DetailTraceability,
      dto.detailTraceability,
    );

    let productTraceability: ProductTraceability | null = null;
    if (dto.productTraceability) {
      productTraceability = plainToInstance(
        ProductTraceability,
        dto.productTraceability,
      );
    }

    const options = (dto.options || []).map((opt) => {
      const values = (opt.values || []).map((item) =>
        plainToInstance(TextileOptionsItem, {
          ...item,
          id: crypto.randomUUID(),
        }),
      );
      return plainToInstance(TextileOptions, {
        ...opt,
        id: crypto.randomUUID(),
        values,
      });
    });

    const variants = (dto.variants || []).map((variant) =>
      plainToInstance(TextileVariant, {
        ...variant,
        id: crypto.randomUUID(),
      }),
    );

    const plain = {
      id: id,
      ...textileProductData,
      baseInfo,
      priceInventary,
      atribute,
      detailTraceability,
      productTraceability,
      options,
      variants,
      updatedAt: new Date(),
      // createdAt no se incluye aquí, se preserva del documento original
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
