import {
	IsString,
	IsInt,
	IsEnum,
	IsOptional,
} from 'class-validator';
import { ProductType } from 'src/andean/domain/enums/ProductType';

export class UpdateReviewDto {
	@IsString()
	@IsOptional()
	content?: string;

	@IsInt()
	@IsOptional()
	numberStarts?: number;

	@IsString()
	@IsOptional()
	customerId?: string;

	@IsString()
	@IsOptional()
	productId?: string;

	@IsEnum(ProductType)
	@IsOptional()
	productType?: ProductType;
}
