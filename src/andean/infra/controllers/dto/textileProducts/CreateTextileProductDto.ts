import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsInt,
  Min,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TextileProductStatus } from 'src/andean/domain/enums/TextileProductStatus';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { Gender } from 'src/andean/domain/enums/Gender';
import { Season } from 'src/andean/domain/enums/Season';
import { ToolUsed } from 'src/andean/domain/enums/ToolUsed';

export class PreparationTimeDto {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  days: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  hours: number;
}

export class BaseInfoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  media: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(OwnerType)
  @IsNotEmpty()
  ownerType: OwnerType;

  @IsString()
  @IsNotEmpty()
  ownerId: string;
}

export class PriceInventaryDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  basePrice: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  totalStock: number;

  @IsString()
  @IsNotEmpty()
  SKU: string;
}

export class AtributeDto {
  @IsString()
  @IsNotEmpty()
  textileTypeId: string;

  @IsString()
  @IsNotEmpty()
  subcategoryId: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  textileStyleId: string;

  @IsEnum(Season)
  @IsNotEmpty()
  season: Season;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  principalUse: string[];

  @ValidateNested()
  @Type(() => PreparationTimeDto)
  @IsNotEmpty()
  preparationTime: PreparationTimeDto;
}

export class TextileOptionsItemDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaIds?: string[];
}

export class TextileOptionsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TextileOptionsItemDto)
  @IsNotEmpty()
  values: TextileOptionsItemDto[];
}

export class TextileVariantDto {
  @IsObject()
  @IsNotEmpty()
  combination: Record<string, string>;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  stock: number;
}

export class DetailTraceabilityDto {
  @IsBoolean()
  @IsNotEmpty()
  isHandmade: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  secondaryMaterial: string[];

  @IsString()
  @IsNotEmpty()
  originProductCommunityId: string;

  @IsString()
  @IsNotEmpty()
  craftTechniqueId: string;

  @IsEnum(ToolUsed)
  @IsNotEmpty()
  toolUsed: ToolUsed;

  @IsBoolean()
  @IsNotEmpty()
  isArtisanExclusive: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isOriginalCreation: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isRegisteredDesign: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isBackorderAvailable: boolean;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  leadTime: number;

  @IsString()
  @IsNotEmpty()
  certificationId: string;
}

export class CreateTextileProductDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(TextileProductStatus)
  @IsNotEmpty()
  status: TextileProductStatus;

  @ValidateNested()
  @Type(() => BaseInfoDto)
  @IsNotEmpty()
  baseInfo: BaseInfoDto;

  @ValidateNested()
  @Type(() => PriceInventaryDto)
  @IsNotEmpty()
  priceInventary: PriceInventaryDto;

  @ValidateNested()
  @Type(() => AtributeDto)
  @IsOptional()
  atribute?: AtributeDto;

  @ValidateNested()
  @Type(() => DetailTraceabilityDto)
  @IsNotEmpty()
  detailTraceability: DetailTraceabilityDto;

  @IsOptional()
  productTraceability?: any;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TextileOptionsDto)
  options?: TextileOptionsDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TextileVariantDto)
  variants?: TextileVariantDto[];
}
