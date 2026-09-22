import { VariantDocument } from '../persistence/variant.schema';
import { Variant } from '../../domain/entities/Variant';
import { CreateVariantDto } from '../controllers/dto/variant/CreateVariantDto';
import { UpdateVariantDto } from '../controllers/dto/variant/UpdateVariantDto';
import { Types } from 'mongoose';
import { MongoIdUtils } from '../utils/MongoIdUtils';

export class VariantMapper {
	static fromDocument(doc: VariantDocument): Variant {
		const plain = doc.toObject();
		return new Variant(
			MongoIdUtils.objectIdToString(plain._id as Types.ObjectId),
			plain.productId,
			plain.productType,
			plain.combination,
			plain.price,
			plain.stock,
			plain.createdAt,
			plain.updatedAt,
			plain.sku,
		);
	}

	static fromCreateDto(dto: CreateVariantDto): Variant {
		const now = new Date();
		return new Variant(
			new Types.ObjectId().toString(),
			dto.productId,
			dto.productType,
			dto.combination,
			dto.price,
			dto.stock,
			now,
			now,
			dto.sku !== undefined && dto.sku !== '' ? dto.sku : undefined,
		);
	}

	static fromUpdateDto(id: string, dto: UpdateVariantDto): Partial<Variant> {
		return {
			...(dto.combination !== undefined && { combination: dto.combination }),
			...(dto.price !== undefined && { price: dto.price }),
			...(dto.stock !== undefined && { stock: dto.stock }),
			...(dto.sku !== undefined && { sku: dto.sku }),
			updatedAt: new Date(),
		};
	}

	static toPersistence(
		variant: Variant | Partial<Variant>,
	): Record<string, unknown> {
		const data: Record<string, unknown> = {};
		if (variant.productId !== undefined) data.productId = variant.productId;
		if (variant.productType !== undefined) {
			data.productType = variant.productType;
		}
		if (variant.combination !== undefined) {
			data.combination = variant.combination;
		}
		if (variant.price !== undefined) data.price = variant.price;
		if (variant.stock !== undefined) data.stock = variant.stock;
		if (variant.sku !== undefined) data.sku = variant.sku;
		if (variant.createdAt !== undefined) data.createdAt = variant.createdAt;
		if (variant.updatedAt !== undefined) {
			data.updatedAt = variant.updatedAt;
		} else {
			data.updatedAt = new Date();
		}
		return data;
	}
}
