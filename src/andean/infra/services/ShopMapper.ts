import { ShopDocument } from '../persistence/shop.schema';
import { Shop } from '../../domain/entities/Shop';
import { CreateShopDto } from '../controllers/dto/CreateShopDto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { AdminEntityStatus } from '../../domain/enums/AdminEntityStatus';

export class ShopMapper {
	static fromDocument(doc: ShopDocument): Shop {
		const plain = doc.toObject();
		return plainToInstance(Shop, {
			id: plain._id.toString(),
			status:
				plain.status === AdminEntityStatus.PUBLISHED
					? AdminEntityStatus.PUBLISHED
					: AdminEntityStatus.HIDDEN,
			...plain,
		});
	}

	/**
	 * Crea una entidad Shop desde el DTO de creación (asigna id nuevo).
	 */
	static fromCreateDto(dto: CreateShopDto): Shop {
		const { ...shopData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...shopData,
			status: AdminEntityStatus.HIDDEN,
		};
		return plainToInstance(Shop, plain);
	}

	/**
	 * Convierte la entidad Shop a objeto plano para persistencia.
	 */
	static toPersistence(shop: Shop | Partial<Shop>) {
		const plain = instanceToPlain(shop);
		const { id, _id, __v, ...updateData } = plain;
		return {
			...updateData,
		};
	}
}
