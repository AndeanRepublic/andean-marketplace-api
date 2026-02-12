import {
	IsString,
	IsNotEmpty,
	IsInt,
	IsEnum,
	IsOptional,
	IsMongoId,
} from 'class-validator';
import { ProductType } from 'src/andean/domain/enums/ProductType';

export class CreateReviewDto {
	@IsString()
	@IsNotEmpty()
	content!: string;

	@IsInt()
	@IsNotEmpty()
	numberStarts!: number;

	@IsString()
	@IsMongoId()
	@IsOptional()
	mediaId?: string;

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
