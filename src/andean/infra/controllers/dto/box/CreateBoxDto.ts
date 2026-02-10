import {
	IsString,
	IsNotEmpty,
	IsNumber,
	IsArray,
	ArrayNotEmpty,
	ValidateNested,
	IsOptional,
	Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BoxProductDto {
	@IsString()
	@IsOptional()
	productId?: string;

	@IsString()
	@IsOptional()
	variantId?: string;
}

export class CreateBoxDto {
	@IsString()
	@IsNotEmpty()
	title!: string;

	@IsString()
	@IsNotEmpty()
	subtitle!: string;

	@IsString()
	@IsNotEmpty()
	description!: string;

	@IsString()
	@IsNotEmpty()
	thumbnailImageId!: string;

	@IsString()
	@IsNotEmpty()
	mainImageId!: string;

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => BoxProductDto)
	products!: BoxProductDto[];

	@IsNumber()
	@Min(0.01)
	price!: number;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	sealIds?: string[];
}
