import { SuperfoodProductDocument } from '../../persistence/superfood/superfood.schema';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { CreateSuperfoodDto } from '../../controllers/dto/superfoods/CreateSuperfoodDto';
import { SuperfoodProductStatus } from '../../../domain/enums/SuperfoodProductStatus';
import { SuperfoodBasicInfo } from '../../../domain/entities/superfoods/SuperfoodBasicInfo';
import { SuperfoodPriceInventory } from '../../../domain/entities/superfoods/SuperfoodPriceInventory';
import { SuperfoodDetailProduct } from '../../../domain/entities/superfoods/SuperfoodDetailProduct';
import { SuperfoodNutritionalItem } from '../../../domain/entities/superfoods/SuperfoodNutritionalItem';
import { SuperfoodDetailTraceability } from '../../../domain/entities/superfoods/SuperfoodDetailTraceability';
import { SuperfoodElaborationTime } from '../../../domain/entities/superfoods/SuperfoodElaborationTime';
import { SuperfoodOptions } from '../../../domain/entities/superfoods/SuperfoodOptions';
import { SuperfoodOptionsItem } from '../../../domain/entities/superfoods/SuperfoodOptionsItem';
import { ProductTraceability } from '../../../domain/entities/ProductTraceability';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import * as crypto from 'crypto';
import { Types } from 'mongoose';

export class SuperfoodProductMapper {
	static fromDocument(doc: SuperfoodProductDocument): SuperfoodProduct {
		const plain = doc.toObject();

		const baseInfo = plainToInstance(SuperfoodBasicInfo, plain.baseInfo);
		const priceInventory = plainToInstance(
			SuperfoodPriceInventory,
			plain.priceInventory,
		);

		let detailProduct: SuperfoodDetailProduct | undefined;
		if (plain.detailProduct) {
			let elaborationTime: SuperfoodElaborationTime | undefined;
			if (plain.detailProduct.elaborationTime) {
				elaborationTime = plainToInstance(
					SuperfoodElaborationTime,
					plain.detailProduct.elaborationTime,
				);
			}
			detailProduct = plainToInstance(SuperfoodDetailProduct, {
				...plain.detailProduct,
				elaborationTime,
			});
		}

		const nutritionalContent = plain.nutritionalContent?.map((item: any) =>
			plainToInstance(SuperfoodNutritionalItem, item),
		);

		let detailTraceability: SuperfoodDetailTraceability | undefined;
		if (plain.detailTraceability) {
			detailTraceability = plainToInstance(
				SuperfoodDetailTraceability,
				plain.detailTraceability,
			);
		}

		let productTraceability: ProductTraceability | undefined;
		if (plain.productTraceability) {
			productTraceability = plainToInstance(
				ProductTraceability,
				plain.productTraceability,
			);
		}

			const options = plain.options?.map((opt: any) => {
			const values = (opt.values || []).map((val: any) =>
				plainToInstance(SuperfoodOptionsItem, val),
			);
			return plainToInstance(SuperfoodOptions, { ...opt, values });
		});

		return plainToInstance(SuperfoodProduct, {
			id: plain._id.toString(),
			...plain,
			baseInfo,
			priceInventory,
			detailProduct,
			nutritionalContent,
			detailTraceability,
			productTraceability,
			options,
			isDiscountActive: plain.isDiscountActive ?? false,
			createdAt: plain.createdAt || new Date(),
			updatedAt: plain.updatedAt || new Date(),
		});
	}

	static fromCreateDto(dto: CreateSuperfoodDto): SuperfoodProduct {
		const { ...superfoodProductData } = dto;
		const baseInfo = plainToInstance(SuperfoodBasicInfo, dto.baseInfo);
		const priceInventory = plainToInstance(
			SuperfoodPriceInventory,
			dto.priceInventory,
		);

		let detailProduct: SuperfoodDetailProduct | undefined;
		if (dto.detailProduct) {
			let elaborationTime: SuperfoodElaborationTime | undefined;
			if (dto.detailProduct.elaborationTime) {
				elaborationTime = plainToInstance(
					SuperfoodElaborationTime,
					dto.detailProduct.elaborationTime,
				);
			}
			detailProduct = plainToInstance(SuperfoodDetailProduct, {
				...dto.detailProduct,
				elaborationTime,
			});
		}

		const nutritionalContent = dto.nutritionalContent?.map(
			(item: any): SuperfoodNutritionalItem =>
				plainToInstance(SuperfoodNutritionalItem, {
					...item,
					id: crypto.randomUUID(),
				}),
		);

		let detailTraceability: SuperfoodDetailTraceability | undefined;
		if (dto.detailTraceability) {
			detailTraceability = plainToInstance(
				SuperfoodDetailTraceability,
				dto.detailTraceability,
			);
		}

		let productTraceability: ProductTraceability | undefined;
		if (dto.productTraceability) {
			productTraceability = plainToInstance(
				ProductTraceability,
				dto.productTraceability,
			);
		}

		const options = dto.options?.map((opt) => {
			const values = (opt.values || []).map((val) =>
				plainToInstance(SuperfoodOptionsItem, {
					...val,
					id: crypto.randomUUID(),
				}),
			);
			return plainToInstance(SuperfoodOptions, {
				...opt,
				id: crypto.randomUUID(),
				values,
			});
		});

		const plain = {
			id: new Types.ObjectId().toString(),
			...superfoodProductData,
			baseInfo,
			priceInventory,
			detailProduct,
			nutritionalContent,
			detailTraceability,
			productTraceability,
			options,
			isDiscountActive: dto.isDiscountActive ?? false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		return plainToInstance(SuperfoodProduct, plain);
	}

	static fromUpdateDto(id: string, dto: CreateSuperfoodDto): SuperfoodProduct {
		const { ...superfoodProductData } = dto;
		const baseInfo = plainToInstance(SuperfoodBasicInfo, dto.baseInfo);
		const priceInventory = plainToInstance(
			SuperfoodPriceInventory,
			dto.priceInventory,
		);

		let detailProduct: SuperfoodDetailProduct | undefined;
		if (dto.detailProduct) {
			let elaborationTime: SuperfoodElaborationTime | undefined;
			if (dto.detailProduct.elaborationTime) {
				elaborationTime = plainToInstance(
					SuperfoodElaborationTime,
					dto.detailProduct.elaborationTime,
				);
			}
			detailProduct = plainToInstance(SuperfoodDetailProduct, {
				...dto.detailProduct,
				elaborationTime,
			});
		}

		const nutritionalContent = dto.nutritionalContent?.map(
			(item: any): SuperfoodNutritionalItem =>
				plainToInstance(SuperfoodNutritionalItem, {
					...item,
					id: crypto.randomUUID(),
				}),
		);

		let detailTraceability: SuperfoodDetailTraceability | undefined;
		if (dto.detailTraceability) {
			detailTraceability = plainToInstance(
				SuperfoodDetailTraceability,
				dto.detailTraceability,
			);
		}

		let productTraceability: ProductTraceability | undefined;
		if (dto.productTraceability) {
			productTraceability = plainToInstance(
				ProductTraceability,
				dto.productTraceability,
			);
		}

		const options = dto.options?.map((opt) => {
			const values = (opt.values || []).map((val) =>
				plainToInstance(SuperfoodOptionsItem, {
					...val,
					id: crypto.randomUUID(),
				}),
			);
			return plainToInstance(SuperfoodOptions, {
				...opt,
				id: crypto.randomUUID(),
				values,
			});
		});

		const plain = {
			id: id,
			...superfoodProductData,
			baseInfo,
			priceInventory,
			detailProduct,
			nutritionalContent,
			detailTraceability,
			productTraceability,
			options,
			isDiscountActive: dto.isDiscountActive ?? false,
			updatedAt: new Date(),
			// createdAt no se incluye aquí, se preserva del documento original
		};

		return plainToInstance(SuperfoodProduct, plain);
	}

	static toPersistence(product: SuperfoodProduct) {
		const plain = instanceToPlain(product);
		const { _id, id, __v, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
