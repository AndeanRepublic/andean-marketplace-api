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
import { SuperfoodVariant } from '../../../domain/entities/superfoods/SuperfoodVariant';
import { ProductTraceability } from '../../../domain/entities/ProductTraceability';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import * as crypto from 'crypto';

export class SuperfoodProductMapper {
	static fromDocument(doc: SuperfoodProductDocument): SuperfoodProduct {
		const plain = doc.toObject();
		const { _id, ...rest } = plain;

		const baseInfo = plainToInstance(SuperfoodBasicInfo, rest.baseInfo);
		const priceInventory = plainToInstance(
			SuperfoodPriceInventory,
			rest.priceInventory,
		);

		let detailProduct: SuperfoodDetailProduct | undefined;
		if (rest.detailProduct) {
			let elaborationTime: SuperfoodElaborationTime | undefined;
			if (rest.detailProduct.elaborationTime) {
				elaborationTime = plainToInstance(
					SuperfoodElaborationTime,
					rest.detailProduct.elaborationTime,
				);
			}
			detailProduct = plainToInstance(SuperfoodDetailProduct, {
				...rest.detailProduct,
				elaborationTime,
			});
		}

		const nutritionalContent = rest.nutritionalContent?.map((item: any) =>
			plainToInstance(SuperfoodNutritionalItem, item),
		);

		let detailTraceability: SuperfoodDetailTraceability | undefined;
		if (rest.detailTraceability) {
			detailTraceability = plainToInstance(
				SuperfoodDetailTraceability,
				rest.detailTraceability,
			);
		}

		let productTraceability: ProductTraceability | undefined;
		if (rest.productTraceability) {
			productTraceability = plainToInstance(
				ProductTraceability,
				rest.productTraceability,
			);
		}

		const options = rest.options?.map((opt: any) => {
			const values = (opt.values || []).map((val: any) =>
				plainToInstance(SuperfoodOptionsItem, val),
			);
			return plainToInstance(SuperfoodOptions, { ...opt, values });
		});

		const variants = rest.variants?.map((variant: any) =>
			plainToInstance(SuperfoodVariant, variant),
		);

		return plainToInstance(SuperfoodProduct, {
			...rest,
			baseInfo,
			priceInventory,
			detailProduct,
			nutritionalContent,
			detailTraceability,
			productTraceability,
			options,
			variants,
			createdAt: rest.createdAt || new Date(),
			updatedAt: rest.updatedAt || new Date(),
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

		const variants = dto.variants?.map((variant) =>
			plainToInstance(SuperfoodVariant, {
				...variant,
				id: crypto.randomUUID(),
			}),
		);

		const plain = {
			id: crypto.randomUUID(),
			...superfoodProductData,
			baseInfo,
			priceInventory,
			detailProduct,
			nutritionalContent,
			detailTraceability,
			productTraceability,
			options,
			variants,
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

		const variants = dto.variants?.map((variant) =>
			plainToInstance(SuperfoodVariant, {
				...variant,
				id: crypto.randomUUID(),
			}),
		);

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
			variants,
			updatedAt: new Date(),
			// createdAt no se incluye aquí, se preserva del documento original
		};

		return plainToInstance(SuperfoodProduct, plain);
	}

	static toPersistence(product: SuperfoodProduct) {
		const plain = instanceToPlain(product);
		const { _id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
