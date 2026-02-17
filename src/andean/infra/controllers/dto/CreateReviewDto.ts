import {
	IsString,
	IsNotEmpty,
	IsInt,
	IsEnum,
	IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductType } from 'src/andean/domain/enums/ProductType';
import { MediaItemType } from 'src/andean/domain/enums/MediaItemType';
import { MediaItemRole } from 'src/andean/domain/enums/MediaItemRole';

export class CreateReviewDto {
	@IsString()
	@IsNotEmpty()
	content!: string;

	@Transform(({ value }) => parseInt(value))
	@IsInt()
	@IsNotEmpty()
	numberStarts!: number;

	// Campos opcionales para subir media directamente
	@IsEnum(MediaItemType)
	@IsOptional()
	mediaType?: MediaItemType;

	@IsString()
	@IsOptional()
	mediaName?: string;

	@IsEnum(MediaItemRole)
	@IsOptional()
	mediaRole?: MediaItemRole;

	@IsString()
	@IsNotEmpty()
	customerId!: string;

	@IsString()
	@IsNotEmpty()
	productId!: string;

	@IsEnum(ProductType)
	@IsNotEmpty()
	productType!: ProductType;
}
