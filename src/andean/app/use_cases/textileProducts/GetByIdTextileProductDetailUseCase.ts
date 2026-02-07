import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProductDetailResponse } from '../../models/TextileProducts/TextileProductDetailResponse';
import { ProductType } from '../../../domain/enums/ProductType';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { TextileOptionName } from '../../../domain/enums/TextileOptionName';
import { ReviewRepository } from '../../datastore/Review.repo';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { ColorOptionAlternativeRepository } from '../../datastore/textileProducts/ColorOptionAlternative.repo';
import { SizeOptionAlternativeRepository } from '../../datastore/textileProducts/SizeOptionAlternative.repo';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { Review } from 'src/andean/domain/entities/Review';
import { Variant } from 'src/andean/domain/entities/Variant';

@Injectable()
export class GetByIdTextileProductDetailUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerProfileRepository: CustomerProfileRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		@Inject(ColorOptionAlternativeRepository)
		private readonly colorOptionAlternativeRepository: ColorOptionAlternativeRepository,
		@Inject(SizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SizeOptionAlternativeRepository,
		@Inject(TextileCategoryRepository)
		private readonly textileCategoryRepository: TextileCategoryRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) { }

	async handle(id: string): Promise<TextileProductDetailResponse> {
		// 1. Obtener el producto principal
		const product =
			await this.textileProductRepository.getTextileProductById(id);
		if (!product) {
			throw new NotFoundException('Textile product not found');
		}

		// 2. Obtener reviews del producto
		const reviews = await this.reviewRepository.getByProductIdAndType(
			id,
			ProductType.TEXTILE,
		);

		// 3. Obtener customers para las reviews
		const customerPromises = reviews.map((review) =>
			this.customerProfileRepository.getCustomerById(review.customerId),
		);
		const customers = await Promise.all(customerPromises);

		// 4. Calcular estadísticas de ratings
		const ratingStats = this.calculateRatingStats(reviews);

		// 5. Mapear comments de reviews
		const comments = reviews.map((review, index) => ({
			idReview: review.id,
			nameUser: customers[index]?.name || 'Usuario Anónimo',
			content: review.content,
			numberStarts: review.numberStarts,
			date: review.createdAt,
			likes: review.numberLikes,
			dislikes: review.numberDislikes,
		}));

		// 6. Obtener sizes y colors de options
		const sizeOption = product.options?.find(
			(opt) => opt.name === TextileOptionName.SIZE,
		);
		const colorOption = product.options?.find(
			(opt) => opt.name === TextileOptionName.COLOR,
		);
		const materialOption = product.options?.find(
			(opt) => opt.name === TextileOptionName.MATERIAL,
		);

		// 7. Obtener availableSizes
		const availableSizes: string[] = [];
		if (sizeOption) {
			for (const value of sizeOption.values) {
				if (value.idOpcionAlternative) {
					const sizeAlt = await this.sizeOptionAlternativeRepository.getById(
						value.idOpcionAlternative,
					);
					if (sizeAlt && !availableSizes.includes(sizeAlt.nameLabel)) {
						availableSizes.push(sizeAlt.nameLabel);
					}
				} else if (value.label && !availableSizes.includes(value.label)) {
					availableSizes.push(value.label);
				}
			}
		}

		// 8. Obtener availableColors
		const availableColors: string[] = [];
		if (colorOption) {
			for (const value of colorOption.values) {
				if (value.idOpcionAlternative) {
					const colorAlt = await this.colorOptionAlternativeRepository.getById(
						value.idOpcionAlternative,
					);
					if (colorAlt && !availableColors.includes(colorAlt.nameLabel)) {
						availableColors.push(colorAlt.nameLabel);
					}
				} else if (value.label && !availableColors.includes(value.label)) {
					availableColors.push(value.label);
				}
			}
		}

		// 9. Obtener availableMaterials
		const availableMaterials: string[] = [];
		if (materialOption) {
			for (const value of materialOption.values) {
				if (value.label && !availableMaterials.includes(value.label)) {
					availableMaterials.push(value.label);
				}
			}
		}

		// 10. Obtener variants del producto
		const variants = await this.variantRepository.getByProductId(product.id);

		// 11. Construir variantInfo
		const variantInfo = await this.buildVariantInfo(
			variants,
			sizeOption,
			colorOption,
			materialOption,
		);

		// 12. Agrupar traceability epochs y agregar blockchainLink
		const groupedEpochs = this.groupTraceabilityEpochs(
			product.productTraceability?.epochs || [],
		);
		const traceabilityInfo = {
			...(product.productTraceability?.blockchainLink && {
				blockchainLink: product.productTraceability.blockchainLink,
			}),
			...groupedEpochs,
		};

		// 13. Obtener productos similares
		const similarProducts = await this.getSimilarProducts(
			product.id,
			product.categoryId,
		);

		// 14. Obtener communityInfo si es COMMUNITY
		let communityInfo:
			| {
				bannerImageId: string;
				name: string;
				seals: { title: string; description: string; logoMediaId: string }[];
			}
			| undefined = undefined;
		if (product.baseInfo.ownerType === OwnerType.COMMUNITY) {
			const community = await this.communityRepository.getById(
				product.baseInfo.ownerId,
			);
			if (community) {
				const seals = community.seals
					? await Promise.all(
						community.seals.map((sealId) =>
							this.sealRepository.getById(sealId),
						),
					)
					: [];

				communityInfo = {
					bannerImageId: community.bannerImageId,
					name: community.name,
					seals: seals
						.filter((seal): seal is NonNullable<typeof seal> => seal !== null)
						.map((seal) => ({
							title: seal.name,
							description: seal.description,
							logoMediaId: seal.logoMediaId,
						})),
				};
			}
		}

		// 15. Obtener category name
		let categoryName = '';
		if (product.categoryId) {
			const category = await this.textileCategoryRepository.getCategoryById(
				product.categoryId,
			);
			categoryName = category?.name || '';
		}

		// 16. Construir respuesta completa
		return {
			name: product.baseInfo.title,
			availableSizes,
			availableColors,
			availableMaterials,
			variantInfo,
			generalStock: product.priceInventary.totalStock,
			information: product.baseInfo.information || '',
			description: product.baseInfo.description,
			traceabilityInfo,
			reviews: {
				rating: ratingStats,
				comments,
			},
			similarProducts,
			...(communityInfo && { communityInfo }),
		};
	}

	private calculateRatingStats(reviews: Review[]) {
		const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
		let totalStars = 0;

		reviews.forEach((review) => {
			const stars = review.numberStarts;
			if (stars >= 1 && stars <= 5) {
				counts[stars as keyof typeof counts]++;
				totalStars += stars;
			}
		});

		const totalReviews = reviews.length;
		const averagePunctuation = totalReviews > 0 ? totalStars / totalReviews : 0;

		return {
			count5stars: counts[5],
			count4stars: counts[4],
			count3stars: counts[3],
			count2stars: counts[2],
			count1star: counts[1],
			totalReviews,
			averagePunctuation: Math.round(averagePunctuation * 10) / 10, // Redondear a 1 decimal
		};
	}

	private async buildVariantInfo(
		variants: Variant[],
		sizeOption: any,
		colorOption: any,
		materialOption: any,
	): Promise<
		{
			size: string;
			color: string;
			material: string;
			price: number;
			stock: number;
		}[]
	> {
		if (!variants || variants.length === 0) {
			return [];
		}

		const variantInfoArray: {
			size: string;
			color: string;
			material: string;
			price: number;
			stock: number;
		}[] = [];

		for (const variant of variants) {
			// Obtener size del combination
			let size = '';
			if (sizeOption && variant.combination[TextileOptionName.SIZE]) {
				const sizeLabel = variant.combination[TextileOptionName.SIZE];
				const sizeValue = sizeOption.values.find(
					(v: any) => v.label === sizeLabel,
				);
				if (sizeValue?.idOpcionAlternative) {
					const sizeAlt = await this.sizeOptionAlternativeRepository.getById(
						sizeValue.idOpcionAlternative,
					);
					size = sizeAlt?.nameLabel || sizeValue.label || '';
				} else {
					size = sizeValue?.label || sizeLabel || '';
				}
			}

			// Obtener color del combination
			let color = '';
			if (colorOption && variant.combination[TextileOptionName.COLOR]) {
				const colorLabel = variant.combination[TextileOptionName.COLOR];
				const colorValue = colorOption.values.find(
					(v: any) => v.label === colorLabel,
				);
				if (colorValue?.idOpcionAlternative) {
					const colorAlt = await this.colorOptionAlternativeRepository.getById(
						colorValue.idOpcionAlternative,
					);
					color = colorAlt?.nameLabel || colorValue.label || '';
				} else {
					color = colorValue?.label || colorLabel || '';
				}
			}

			// Obtener material del combination
			let material = '';
			if (materialOption && variant.combination[TextileOptionName.MATERIAL]) {
				const materialLabel = variant.combination[TextileOptionName.MATERIAL];
				const materialValue = materialOption.values.find(
					(v: any) => v.label === materialLabel,
				);
				material = materialValue?.label || materialLabel || '';
			} else {
				material = '';
			}

			variantInfoArray.push({
				size,
				color,
				material,
				price: variant.price,
				stock: variant.stock,
			});
		}

		return variantInfoArray;
	}

	private groupTraceabilityEpochs(epochs: any[]) {
		const grupos: any = {
			origen: [],
			processing: [],
			development: [],
			merchandising: [],
		};

		epochs.forEach((epoch) => {
			const processNameLower = epoch.processName?.toLowerCase() || '';

			// Determinar el grupo basado en processName
			if (
				processNameLower.includes('origen') ||
				processNameLower.includes('origin') ||
				processNameLower.includes('cosecha') ||
				processNameLower.includes('cultivo')
			) {
				grupos.origen.push({
					title: epoch.title,
					supplier: epoch.supplier,
					country: epoch.country,
					city: epoch.city,
					description: epoch.description,
				});
			} else if (
				processNameLower.includes('processing') ||
				processNameLower.includes('procesamiento') ||
				processNameLower.includes('transformación')
			) {
				grupos.processing.push({
					title: epoch.title,
					supplier: epoch.supplier,
					country: epoch.country,
					city: epoch.city,
					description: epoch.description,
				});
			} else if (
				processNameLower.includes('development') ||
				processNameLower.includes('desarrollo') ||
				processNameLower.includes('elaboración')
			) {
				grupos.development.push({
					title: epoch.title,
					supplier: epoch.supplier,
					country: epoch.country,
					city: epoch.city,
					description: epoch.description,
				});
			} else if (
				processNameLower.includes('merchandising') ||
				processNameLower.includes('comercialización') ||
				processNameLower.includes('venta')
			) {
				grupos.merchandising.push({
					title: epoch.title,
					supplier: epoch.supplier,
					country: epoch.country,
					city: epoch.city,
					description: epoch.description,
				});
			}
		});

		return grupos;
	}

	private async getSimilarProducts(
		currentProductId: string,
		categoryId?: string,
	): Promise<
		{
			title: string;
			categoryName: string;
			productorName: string;
			colors: { colorName: string; colorHexCode: string }[];
			sizes: string[];
			principalImgUrl: string;
			price: number;
		}[]
	> {
		if (!categoryId) {
			return [];
		}

		// Obtener todos los productos de la misma categoría
		const allProducts =
			await this.textileProductRepository.getAllTextileProducts();
		const similarProducts = allProducts.filter(
			(p) => p.id !== currentProductId && p.categoryId === categoryId,
		);

		// Limitar a los primeros 5 productos similares
		const limitedProducts = similarProducts.slice(0, 5);

		// Obtener category name
		const category =
			await this.textileCategoryRepository.getCategoryById(categoryId);

		// Mapear productos similares
		const mappedProducts = await Promise.all(
			limitedProducts.map(async (product) => {
				// Obtener owner name (shop o community)
				let productorName = '';
				if (product.baseInfo.ownerType === OwnerType.SHOP) {
					const shop = await this.shopRepository.getById(
						product.baseInfo.ownerId,
					);
					productorName = shop?.name || '';
				} else if (product.baseInfo.ownerType === OwnerType.COMMUNITY) {
					const community = await this.communityRepository.getById(
						product.baseInfo.ownerId,
					);
					productorName = community?.name || '';
				}

				// Obtener colors
				const colorOption = product.options?.find(
					(opt) => opt.name === TextileOptionName.COLOR,
				);
				const colors: { colorName: string; colorHexCode: string }[] = [];

				if (colorOption) {
					for (const value of colorOption.values) {
						if (value.idOpcionAlternative) {
							const colorAlt =
								await this.colorOptionAlternativeRepository.getById(
									value.idOpcionAlternative,
								);
							if (colorAlt) {
								colors.push({
									colorName: colorAlt.nameLabel,
									colorHexCode: colorAlt.hexCode,
								});
							}
						}
					}
				}

				// Obtener sizes
				const sizeOption = product.options?.find(
					(opt) => opt.name === TextileOptionName.SIZE,
				);
				const sizes: string[] = [];

				if (sizeOption) {
					for (const value of sizeOption.values) {
						if (value.idOpcionAlternative) {
							const sizeAlt =
								await this.sizeOptionAlternativeRepository.getById(
									value.idOpcionAlternative,
								);
							if (sizeAlt && !sizes.includes(sizeAlt.nameLabel)) {
								sizes.push(sizeAlt.nameLabel);
							}
						} else if (value.label && !sizes.includes(value.label)) {
							sizes.push(value.label);
						}
					}
				}

				return {
					title: product.baseInfo.title,
					categoryName: category?.name || '',
					productorName,
					colors,
					sizes,
					principalImgUrl: product.baseInfo.mediaIds?.[0] || '',
					price: product.priceInventary.basePrice,
				};
			}),
		);

		return mappedProducts;
	}
}
