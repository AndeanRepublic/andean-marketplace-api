import { ShopDocument } from '../../persistence/shop/shop.schema';
import { Shop } from '../../../domain/entities/shop/Shop';
import { CreateShopDto } from '../../controllers/dto/shop/CreateShopDto';
import { instanceToPlain } from 'class-transformer';
import { Types } from 'mongoose';
import { ShopStatus } from '../../../domain/enums/ShopStatus';

export class ShopMapper {
	static fromDocument(doc: ShopDocument): Shop {
		const plain = doc.toObject();
		return new Shop(
			plain._id.toString(),
			plain.sellerId,
			plain.name,
			plain.status,
			plain.categories,
			plain.imageOrIconMediaId,
			plain.providerInfoId,
			plain.seals,
			plain.activePage ?? false,
			plain.pageInfoId,
			plain.founderInfoId,
		);
	}

	/**
	 * Crea una entidad Shop desde el DTO de creación (asigna id nuevo).
	 */
	static fromCreateDto(
		dto: CreateShopDto & { providerInfoId?: string; pageInfoId?: string; founderInfoId?: string },
		initialStatus: ShopStatus = ShopStatus.PENDING,
	): Shop {
		return new Shop(
			new Types.ObjectId().toString(),
			dto.sellerId,
			dto.name,
			initialStatus,
			dto.categories,
			dto.imageOrIconMediaId,
			dto.providerInfoId,
			dto.seals,
			dto.activePage ?? false,
			dto.pageInfoId,
			dto.founderInfoId,
		);
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
