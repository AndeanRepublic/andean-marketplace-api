import { VariantDocument } from '../persistence/variant.schema';
import { Variant } from '../../domain/entities/Variant';
import { CreateVariantDto } from '../controllers/dto/variant/CreateVariantDto';
import { UpdateVariantDto } from '../controllers/dto/variant/UpdateVariantDto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { MongoIdUtils } from '../utils/MongoIdUtils';

export class VariantMapper {
	/**
	 * Convierte un documento de MongoDB a entidad de dominio
	 * ObjectId (_id) → string (id)
	 */
	static fromDocument(doc: VariantDocument): Variant {
		const plain = doc.toObject();
		return plainToInstance(Variant, {
			id: MongoIdUtils.objectIdToString(plain._id as Types.ObjectId),
			...plain,
		});
	}

	static fromCreateDto(dto: CreateVariantDto): Variant {
		const now = new Date();
		const plain = {
			id: new Types.ObjectId().toString(),
			productId: dto.productId,
			productType: dto.productType,
			combination: dto.combination,
			price: dto.price,
			stock: dto.stock,
			createdAt: now,
			updatedAt: now,
		};
		return plainToInstance(Variant, plain);
	}

	static fromUpdateDto(id: string, dto: UpdateVariantDto): Partial<Variant> {
		return {
			...(dto.combination !== undefined && { combination: dto.combination }),
			...(dto.price !== undefined && { price: dto.price }),
			...(dto.stock !== undefined && { stock: dto.stock }),
			updatedAt: new Date(),
		};
	}

	/**
	 * Convierte entidad de dominio a formato de persistencia
	 * Excluye el 'id' ya que MongoDB usará _id automáticamente
	 */
	static toPersistence(variant: Variant) {
		const plain = instanceToPlain(variant);
		const { id: _id, ...dataForDB } = plain;
		return dataForDB;
	}
}
