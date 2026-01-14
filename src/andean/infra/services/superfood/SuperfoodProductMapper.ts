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

export class SuperfoodProductMapper {
	static fromDocument(doc: SuperfoodProductDocument): SuperfoodProduct {
		const baseInfo = new SuperfoodBasicInfo(
			doc.baseInfo.title,
			doc.baseInfo.mediaIds,
			doc.baseInfo.description,
			doc.baseInfo.general_features,
			doc.baseInfo.nutritional_features,
			doc.baseInfo.benefits,
			doc.baseInfo.ownerType,
			doc.baseInfo.ownerId,
		);

		const priceInventory = new SuperfoodPriceInventory(
			doc.priceInventory.basePrice,
			doc.priceInventory.totalStock,
			doc.priceInventory.SKU,
		);

		const elaborationTime = new SuperfoodElaborationTime(
			doc.detailProduct.elaborationTime.days,
			doc.detailProduct.elaborationTime.hours,
		);

		const detailProduct = new SuperfoodDetailProduct(
			doc.detailProduct.type,
			doc.detailProduct.productPresentation,
			doc.detailProduct.consumptionWay,
			doc.detailProduct.consumptionSuggestions,
			doc.detailProduct.salesUnitSize,
			doc.detailProduct.medicRecommendations,
			doc.detailProduct.healthWarnings,
			elaborationTime,
		);

		const nutritionalContent = doc.nutritionalContent.map(
			(item: any) => new SuperfoodNutritionalItem(
				item.id,
				item.quantity,
				item.nutrient,
				item.strikingFeature,
				item.selected,
			)
		);

		const detailTraceability = new SuperfoodDetailTraceability(
			doc.detailTraceability.handmade,
			doc.detailTraceability.secondaryMaterials,
			doc.detailTraceability.originProductCommunityId,
			doc.detailTraceability.productionMethod,
			doc.detailTraceability.preservationMethod,
			doc.detailTraceability.isArtesanal,
			doc.detailTraceability.isNatural,
			doc.detailTraceability.isEatableWithoutPrep,
			doc.detailTraceability.canCauseAllergies,
			doc.detailTraceability.certification,
		);

		const productTraceability = new ProductTraceability(doc.productTraceability);

		const options = doc.options?.map((opt: any) =>
			new SuperfoodOptions(
				opt.id,
				opt.name,
				opt.values.map((val: any) => new SuperfoodOptionsItem(val.id, val.label, val.images))
			)
		) || [];

		const variants = doc.variants?.map((variant: any) =>
			new SuperfoodVariant(
				variant.id,
				variant.combination,
				variant.price,
				variant.stock
			)
		) || [];

		return new SuperfoodProduct(
			doc.id,
			doc.categoryId,
			doc.status,
			baseInfo,
			priceInventory,
			detailProduct,
			nutritionalContent,
			detailTraceability,
			productTraceability,
			options,
			variants,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateSuperfoodDto): SuperfoodProduct {
		const id = crypto.randomUUID();

		const baseInfo = new SuperfoodBasicInfo(
			dto.baseInfo.title,
			dto.baseInfo.mediaIds || [],
			dto.baseInfo.description,
			dto.baseInfo.general_features || [],
			dto.baseInfo.nutritional_features || [],
			dto.baseInfo.benefits || [],
			dto.baseInfo.ownerType,
			dto.baseInfo.ownerId,
		);

		const priceInventory = new SuperfoodPriceInventory(
			dto.priceInventory.basePrice,
			dto.priceInventory.totalStock,
			dto.priceInventory.SKU,
		);

		const elaborationTime = new SuperfoodElaborationTime(
			dto.detailProduct.elaborationTime.days,
			dto.detailProduct.elaborationTime.hours,
		);

		const detailProduct = new SuperfoodDetailProduct(
			dto.detailProduct.type,
			dto.detailProduct.productPresentation,
			dto.detailProduct.consumptionWay,
			dto.detailProduct.consumptionSuggestions || '',
			dto.detailProduct.salesUnitSize,
			dto.detailProduct.medicRecommendations || '',
			dto.detailProduct.healthWarnings || '',
			elaborationTime,
		);

		const nutritionalContent = dto.nutritionalContent.map(
			(item) => new SuperfoodNutritionalItem(
				crypto.randomUUID(),
				item.quantity,
				item.nutrient,
				item.strikingFeature,
				item.selected || false,
			)
		);

		const detailTraceability = new SuperfoodDetailTraceability(
			dto.detailProduct.handmade,
			dto.detailProduct.secondaryMaterials || [],
			dto.detailProduct.originProductCommunityId,
			dto.detailProduct.productionMethod,
			dto.detailProduct.preservationMethod,
			dto.detailProduct.isArtesanal,
			dto.detailProduct.isNatural,
			dto.detailProduct.isEatableWithoutPrep,
			dto.detailProduct.canCauseAllergies,
			dto.detailProduct.certification || '',
		);

		const productTraceability = new ProductTraceability(dto.productTraceability || {});

		const options = dto.options?.map((opt) =>
			new SuperfoodOptions(
				crypto.randomUUID(),
				opt.name,
				opt.values.map((val) => new SuperfoodOptionsItem(
					crypto.randomUUID(),
					val.label,
					val.images
				))
			)
		) || [];

		const variants = dto.variants?.map((variant) =>
			new SuperfoodVariant(
				crypto.randomUUID(),
				variant.combination,
				variant.price,
				variant.stock
			)
		) || [];

		return new SuperfoodProduct(
			id,
			dto.categoryId,
			dto.status || SuperfoodProductStatus.PENDING,
			baseInfo,
			priceInventory,
			detailProduct,
			nutritionalContent,
			detailTraceability,
			productTraceability,
			options,
			variants,
			new Date(),
			new Date(),
		);
	}

	static toPersistence(product: SuperfoodProduct) {
		return {
			id: product.id,
			categoryId: product.categoryId,
			status: product.status,
			baseInfo: {
				title: product.baseInfo.title,
				mediaIds: product.baseInfo.mediaIds,
				description: product.baseInfo.description,
				general_features: product.baseInfo.general_features,
				nutritional_features: product.baseInfo.nutritional_features,
				benefits: product.baseInfo.benefits,
				ownerType: product.baseInfo.ownerType,
				ownerId: product.baseInfo.ownerId,
			},
			priceInventory: {
				basePrice: product.priceInventory.basePrice,
				totalStock: product.priceInventory.totalStock,
				SKU: product.priceInventory.SKU,
			},
			detailProduct: {
				type: product.detailProduct.type,
				productPresentation: product.detailProduct.productPresentation,
				consumptionWay: product.detailProduct.consumptionWay,
				consumptionSuggestions: product.detailProduct.consumptionSuggestions,
				salesUnitSize: product.detailProduct.salesUnitSize,
				medicRecommendations: product.detailProduct.medicRecommendations,
				healthWarnings: product.detailProduct.healthWarnings,
				elaborationTime: {
					days: product.detailProduct.elaborationTime.days,
					hours: product.detailProduct.elaborationTime.hours,
				},
			},
			nutritionalContent: product.nutritionalContent.map(item => ({
				id: item.id,
				quantity: item.quantity,
				nutrient: item.nutrient,
				strikingFeature: item.strikingFeature,
				selected: item.selected,
			})),
			detailTraceability: {
				handmade: product.detailTraceability.handmade,
				secondaryMaterials: product.detailTraceability.secondaryMaterials,
				originProductCommunityId: product.detailTraceability.originProductCommunityId,
				productionMethod: product.detailTraceability.productionMethod,
				preservationMethod: product.detailTraceability.preservationMethod,
				isArtesanal: product.detailTraceability.isArtesanal,
				isNatural: product.detailTraceability.isNatural,
				isEatableWithoutPrep: product.detailTraceability.isEatableWithoutPrep,
				canCauseAllergies: product.detailTraceability.canCauseAllergies,
				certification: product.detailTraceability.certification,
			},
			productTraceability: product.productTraceability.data,
			options: product.options.map(opt => ({
				id: opt.id,
				name: opt.name,
				values: opt.values.map(val => ({
					id: val.id,
					label: val.label,
					images: val.images,
				})),
			})),
			variants: product.variants.map(variant => ({
				id: variant.id,
				combination: variant.combination,
				price: variant.price,
				stock: variant.stock,
			})),
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		};
	}
}
