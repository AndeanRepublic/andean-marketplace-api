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
import { CreateProductTraceabilityDto } from '../traceability/CreateProductTraceabilityDto';

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
  @IsOptional()
  SKU?: string;
}

export class AtributeDto {
  @IsString()
  @IsOptional()
  textileTypeId?: string;

  @IsString()
  @IsOptional()
  subcategoryId?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  textileStyleId?: string;

  @IsEnum(Season)
  @IsOptional()
  season?: Season;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  principalUse?: string[];

  @ValidateNested()
  @Type(() => PreparationTimeDto)
  @IsOptional()
  preparationTime?: PreparationTimeDto;
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
  @IsOptional()
  isHandmade?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  secondaryMaterial?: string[];

  @IsString()
  @IsOptional()
  originProductCommunityId?: string;

  @IsString()
  @IsOptional()
  craftTechniqueId?: string;

  @IsEnum(ToolUsed)
  @IsOptional()
  toolUsed?: ToolUsed;

  @IsBoolean()
  @IsOptional()
  isArtisanExclusive?: boolean;

  @IsBoolean()
  @IsOptional()
  isOriginalCreation?: boolean;

  @IsBoolean()
  @IsOptional()
  isRegisteredDesign?: boolean;

  @IsBoolean()
  @IsOptional()
  isBackorderAvailable?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  leadTime?: number;

  @IsString()
  @IsOptional()
  certificationId?: string;
}

export class CreateTextileProductDto {
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

  @IsString()
  @IsOptional()
  categoryId?: string;

  @ValidateNested()
  @Type(() => AtributeDto)
  @IsOptional()
  atribute?: AtributeDto;

  @ValidateNested()
  @Type(() => DetailTraceabilityDto)
  @IsOptional()
  detailTraceability?: DetailTraceabilityDto;

  @IsOptional()
  productTraceability?: CreateProductTraceabilityDto;

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
