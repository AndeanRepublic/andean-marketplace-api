import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductDocument } from '../../persistence/textileProducts/textileProduct.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextileProductDto } from '../../controllers/dto/textileProducts/CreateTextileProductDto';
import { UpdateTextileProductDto } from '../../controllers/dto/textileProducts/UpdateTextileProductDto';
import { BaseInfo } from 'src/andean/domain/entities/textileProducts/BaseInfo';
import { PriceInventary } from 'src/andean/domain/entities/textileProducts/PriceInventary';
import { Atribute } from 'src/andean/domain/entities/textileProducts/Atribute';
import { PreparationTime } from 'src/andean/domain/entities/textileProducts/PreparationTime';
import { DetailTraceability } from 'src/andean/domain/entities/textileProducts/DetailTraceability';
import { TextileOptions } from 'src/andean/domain/entities/textileProducts/TextileOptions';
import { TextileOptionsItem } from 'src/andean/domain/entities/textileProducts/TextileOptionsItem';
import { ProductTraceability } from 'src/andean/domain/entities/ProductTraceability';
import { TextileProductStatus } from 'src/andean/domain/enums/TextileProductStatus';
import { ProductCurrency } from 'src/andean/domain/enums/ProductCurrency';
import { Types } from 'mongoose';

export class TextileProductMapper {
	static fromDocument(doc: TextileProductDocument): TextileProduct {
		const plain = doc.toObject();

		// Backwards compatibility: default currency for legacy documents
		const priceInventaryPlain = {
			...plain.priceInventary,
			currency: plain.priceInventary?.currency ?? ProductCurrency.USD,
		};
		const baseInfo = plainToInstance(BaseInfo, plain.baseInfo);
		const priceInventary = plainToInstance(PriceInventary, priceInventaryPlain);

		let atribute: Atribute | undefined;
		if (plain.atribute) {
			let preparationTime: PreparationTime | undefined;
			if (plain.atribute.preparationTime) {
				preparationTime = plainToInstance(
					PreparationTime,
					plain.atribute.preparationTime,
				);
			}
			atribute = plainToInstance(Atribute, {
				...plain.atribute,
				preparationTime,
			});
		}

		// Backwards compatibility: migrate isBackorderAvailable -> availableUponRequest, certificationId -> certificationIds
		let detailTraceabilityPlain = plain.detailTraceability;
		if (detailTraceabilityPlain) {
			const dt = detailTraceabilityPlain as Record<string, unknown>;
			detailTraceabilityPlain = {
				...detailTraceabilityPlain,
				availableUponRequest:
					dt.availableUponRequest ?? dt.isBackorderAvailable,
				certificationIds:
					dt.certificationIds ??
					(dt.certificationId ? [dt.certificationId] : undefined),
			};
		}
		let detailTraceability: DetailTraceability | undefined;
		if (detailTraceabilityPlain) {
			detailTraceability = plainToInstance(
				DetailTraceability,
				detailTraceabilityPlain,
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
			const values = (opt.values || []).map((item: any) =>
				plainToInstance(TextileOptionsItem, item),
			);
			return plainToInstance(TextileOptions, { ...opt, values });
		});

		return plainToInstance(TextileProduct, {
			id: plain._id.toString(),
			...plain,
			baseInfo,
			priceInventary,
			atribute,
			detailTraceability,
			productTraceability,
			options,
			isDiscountActive: plain.isDiscountActive ?? false,
			createdAt: plain.createdAt || new Date(),
			updatedAt: plain.updatedAt || new Date(),
		});
	}

	static fromCreateDto(dto: CreateTextileProductDto): TextileProduct {
		const { ...textileProductData } = dto;
		const baseInfo = plainToInstance(BaseInfo, dto.baseInfo);
		const priceInventary = plainToInstance(PriceInventary, dto.priceInventary);

		let atribute: Atribute | undefined;
		if (dto.atribute) {
			const preparationTime = plainToInstance(
				PreparationTime,
				dto.atribute.preparationTime,
			);
			atribute = plainToInstance(Atribute, {
				...dto.atribute,
				preparationTime,
			});
		}

		let detailTraceability: DetailTraceability | undefined;
		if (dto.detailTraceability) {
			detailTraceability = plainToInstance(
				DetailTraceability,
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

		const options = (dto.options || []).map((opt) => {
			const values = (opt.values || []).map((item) =>
				plainToInstance(TextileOptionsItem, item),
			);
			return plainToInstance(TextileOptions, {
				...opt,
				values,
			});
		});

		const plain = {
			id: new Types.ObjectId().toString(),
			...textileProductData,
			status: TextileProductStatus.PUBLISHED,
			baseInfo,
			priceInventary,
			atribute,
			detailTraceability,
			productTraceability,
			options,
			isDiscountActive: dto.isDiscountActive ?? false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		return plainToInstance(TextileProduct, plain);
	}

	static fromUpdateDto(
		id: string,
		dto: UpdateTextileProductDto,
		existingStatus: TextileProductStatus,
	): TextileProduct {
		const { ...textileProductData } = dto;
		const baseInfo = plainToInstance(BaseInfo, dto.baseInfo);
		const priceInventary = plainToInstance(PriceInventary, dto.priceInventary);

		let atribute: Atribute | undefined;
		if (dto.atribute) {
			let preparationTime: PreparationTime | undefined;
			if (dto.atribute.preparationTime) {
				preparationTime = plainToInstance(
					PreparationTime,
					dto.atribute.preparationTime,
				);
			}
			atribute = plainToInstance(Atribute, {
				...dto.atribute,
				preparationTime,
			});
		}

		let detailTraceability: DetailTraceability | undefined;
		if (dto.detailTraceability) {
			detailTraceability = plainToInstance(
				DetailTraceability,
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
			const values = (opt.values || []).map((item) =>
				plainToInstance(TextileOptionsItem, item),
			);
			return plainToInstance(TextileOptions, {
				...opt,
				values,
			});
		});

		const plain = {
			id: id,
			...textileProductData,
			status: dto.status ?? existingStatus,
			baseInfo,
			priceInventary,
			atribute,
			detailTraceability,
			productTraceability,
			options,
			isDiscountActive: dto.isDiscountActive ?? false,
			updatedAt: new Date(),
			// createdAt no se incluye aquí, se preserva del documento original
		};

		return plainToInstance(TextileProduct, plain);
	}

	static toPersistence(textileProduct: TextileProduct) {
		const plain = instanceToPlain(textileProduct);
		const { id, _id, __v, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
