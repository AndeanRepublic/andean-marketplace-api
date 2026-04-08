import { SuperfoodProductDocument } from '../../persistence/superfood/superfood.schema';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { CreateSuperfoodDto } from '../../controllers/dto/superfoods/CreateSuperfoodDto';
import { SuperfoodBasicInfo } from '../../../domain/entities/superfoods/SuperfoodBasicInfo';
import { SuperfoodProductMedia } from '../../../domain/entities/superfoods/SuperfoodProductMedia';
import { SuperfoodPriceInventory } from '../../../domain/entities/superfoods/SuperfoodPriceInventory';
import { SuperfoodDetailProduct } from '../../../domain/entities/superfoods/SuperfoodDetailProduct';
import { SuperfoodNutritionalItem } from '../../../domain/entities/superfoods/SuperfoodNutritionalItem';
import { SuperfoodDetailTraceability } from '../../../domain/entities/superfoods/SuperfoodDetailTraceability';
import { SuperfoodOptions } from '../../../domain/entities/superfoods/SuperfoodOptions';
import { SuperfoodOptionsItem } from '../../../domain/entities/superfoods/SuperfoodOptionsItem';
import { SuperfoodServingNutrition } from '../../../domain/entities/superfoods/SuperfoodServingNutrition';
import { ProductTraceability } from '../../../domain/entities/ProductTraceability';
import {
	plainToInstance,
	instanceToPlain,
	type ClassConstructor,
} from 'class-transformer';
import { Types } from 'mongoose';
import { SuperfoodProductStatus } from '../../../domain/enums/SuperfoodProductStatus';

/**
 * Un solo objeto desde un plain. Con `any` (p. ej. subdocs de Mongoose), `plainToInstance`
 * resuelve la sobrecarga que devuelve `T[]`; forzando `object` + aserción se usa la de `T`.
 */
function plainToOne<T>(Cls: ClassConstructor<T>, data: unknown): T {
	return plainToInstance(Cls, data as object) as T;
}

export class SuperfoodProductMapper {
	static fromDocument(doc: SuperfoodProductDocument): SuperfoodProduct {
		const plain = doc.toObject();

		const rawBi = plain.baseInfo as Record<string, unknown> | undefined;
		const baseInfo = plainToOne(SuperfoodBasicInfo, {
			...rawBi,
			productMedia: plainToOne(SuperfoodProductMedia, rawBi?.productMedia),
		});
		const priceInventory = plainToOne(
			SuperfoodPriceInventory,
			plain.priceInventory,
		);

		let detailProduct: SuperfoodDetailProduct | undefined;
		if (plain.detailProduct) {
			detailProduct = plainToOne(SuperfoodDetailProduct, plain.detailProduct);
		}

		const servingNutrition = plain.servingNutrition
			? plainToOne(SuperfoodServingNutrition, {
					...((plain.servingNutrition as Record<string, unknown>) ?? {}),
					servingNutritionalContent: (
						(
							plain.servingNutrition as {
								servingNutritionalContent?: unknown[];
							}
						)?.servingNutritionalContent ?? []
					).map((item: unknown) => plainToOne(SuperfoodNutritionalItem, item)),
				})
			: undefined;

		let detailTraceability: SuperfoodDetailTraceability | undefined;
		if (plain.detailTraceability) {
			detailTraceability = plainToOne(
				SuperfoodDetailTraceability,
				plain.detailTraceability,
			);
		}

		let productTraceability: ProductTraceability | undefined;
		if (plain.productTraceability) {
			productTraceability = plainToOne(
				ProductTraceability,
				plain.productTraceability,
			);
		}

		const options = plain.options?.map((opt: unknown) => {
			const o = opt as { values?: unknown[]; [key: string]: unknown };
			const values = (o.values || []).map((val: unknown) =>
				plainToOne(SuperfoodOptionsItem, val),
			);
			return plainToOne(SuperfoodOptions, { ...o, values });
		});

		const colorId =
			typeof plain.colorId === 'string' && plain.colorId.trim()
				? plain.colorId.trim()
				: undefined;

		return plainToOne(SuperfoodProduct, {
			id:
				typeof plain.id === 'string' && plain.id.trim()
					? plain.id.trim()
					: plain._id.toString(),
			status:
				plain.status === SuperfoodProductStatus.PUBLISHED
					? SuperfoodProductStatus.PUBLISHED
					: SuperfoodProductStatus.HIDDEN,
			baseInfo,
			priceInventory,
			detailProduct,
			servingNutrition,
			detailTraceability,
			productTraceability,
			options,
			colorId,
			detailSourceProductId: plain.detailSourceProductId,
			categoryId: plain.categoryId,
			isDiscountActive: plain.isDiscountActive ?? false,
			createdAt: plain.createdAt || new Date(),
			updatedAt: plain.updatedAt || new Date(),
		});
	}

	static fromCreateDto(dto: CreateSuperfoodDto): SuperfoodProduct {
		const { colorId, ...superfoodProductData } = dto;
		const normalizedColorId = colorId?.trim() || undefined;
		const baseInfo = plainToOne(SuperfoodBasicInfo, {
			...dto.baseInfo,
			productMedia: plainToOne(
				SuperfoodProductMedia,
				dto.baseInfo.productMedia,
			),
		});
		const priceInventory = plainToOne(
			SuperfoodPriceInventory,
			dto.priceInventory,
		);

		let detailProduct: SuperfoodDetailProduct | undefined;
		if (dto.detailProduct) {
			detailProduct = plainToOne(SuperfoodDetailProduct, dto.detailProduct);
		}

		const servingNutrition = plainToOne(SuperfoodServingNutrition, {
			servingSize: dto.servingNutrition.servingSize,
			servingUnit: dto.servingNutrition.servingUnit,
			servingNutritionalContent:
				dto.servingNutrition.servingNutritionalContent.map((item) =>
					plainToOne(SuperfoodNutritionalItem, { ...item }),
				),
		});

		let detailTraceability: SuperfoodDetailTraceability | undefined;
		if (dto.detailTraceability) {
			detailTraceability = plainToOne(
				SuperfoodDetailTraceability,
				dto.detailTraceability,
			);
		}

		let productTraceability: ProductTraceability | undefined;
		if (dto.productTraceability) {
			productTraceability = plainToOne(
				ProductTraceability,
				dto.productTraceability,
			);
		}

		const options = dto.options?.map((opt) => {
			const values = (opt.values || []).map((val) =>
				plainToOne(SuperfoodOptionsItem, {
					...val,
				}),
			);
			return plainToOne(SuperfoodOptions, {
				...opt,
				values,
			});
		});

		const plain = {
			id: new Types.ObjectId().toString(),
			...superfoodProductData,
			baseInfo,
			priceInventory,
			detailProduct,
			servingNutrition,
			detailTraceability,
			productTraceability,
			options,
			colorId: normalizedColorId,
			isDiscountActive: dto.isDiscountActive ?? false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		return plainToOne(SuperfoodProduct, plain);
	}

	static fromUpdateDto(id: string, dto: CreateSuperfoodDto): SuperfoodProduct {
		const { colorId, ...superfoodProductData } = dto;
		const normalizedColorId = colorId?.trim() || undefined;
		const baseInfo = plainToOne(SuperfoodBasicInfo, {
			...dto.baseInfo,
			productMedia: plainToOne(
				SuperfoodProductMedia,
				dto.baseInfo.productMedia,
			),
		});
		const priceInventory = plainToOne(
			SuperfoodPriceInventory,
			dto.priceInventory,
		);

		let detailProduct: SuperfoodDetailProduct | undefined;
		if (dto.detailProduct) {
			detailProduct = plainToOne(SuperfoodDetailProduct, dto.detailProduct);
		}

		const servingNutrition = plainToOne(SuperfoodServingNutrition, {
			servingSize: dto.servingNutrition.servingSize,
			servingUnit: dto.servingNutrition.servingUnit,
			servingNutritionalContent:
				dto.servingNutrition.servingNutritionalContent.map((item) =>
					plainToOne(SuperfoodNutritionalItem, { ...item }),
				),
		});

		let detailTraceability: SuperfoodDetailTraceability | undefined;
		if (dto.detailTraceability) {
			detailTraceability = plainToOne(
				SuperfoodDetailTraceability,
				dto.detailTraceability,
			);
		}

		let productTraceability: ProductTraceability | undefined;
		if (dto.productTraceability) {
			productTraceability = plainToOne(
				ProductTraceability,
				dto.productTraceability,
			);
		}

		const options = dto.options?.map((opt) => {
			const values = (opt.values || []).map((val) =>
				plainToOne(SuperfoodOptionsItem, {
					...val,
				}),
			);
			return plainToOne(SuperfoodOptions, {
				...opt,
				values,
			});
		});

		const plain = {
			id: id,
			...superfoodProductData,
			baseInfo,
			priceInventory,
			detailProduct,
			servingNutrition,
			detailTraceability,
			productTraceability,
			options,
			colorId: normalizedColorId,
			isDiscountActive: dto.isDiscountActive ?? false,
			updatedAt: new Date(),
			// createdAt no se incluye aquí, se preserva del documento original
		};

		return plainToOne(SuperfoodProduct, plain);
	}

	static toPersistence(product: SuperfoodProduct) {
		const plain = instanceToPlain(product);
		const { _id, id, __v, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
