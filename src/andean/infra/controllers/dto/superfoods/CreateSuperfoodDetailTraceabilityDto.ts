import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SuperfoodProductionMethod } from '../../../../domain/enums/SuperfoodProductionMethod';

export class CreateSuperfoodDetailTraceabilityDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  handmade?: boolean;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  secondaryMaterials?: string[];

  @ApiProperty({
    description: 'ID de la comunidad de origen del producto',
    required: false,
  })
  @IsString()
  @IsOptional()
  originProductCommunityId?: string;

  @ApiProperty({ enum: SuperfoodProductionMethod, required: false })
  @IsEnum(SuperfoodProductionMethod)
  @IsOptional()
  productionMethod?: SuperfoodProductionMethod;

  @ApiProperty({ description: 'ID de método de preservación', required: false })
  @IsString()
  @IsOptional()
  preservationMethod?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isArtesanal?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isNatural?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isEatableWithoutPrep?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  canCauseAllergies?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  certification?: string;
}
