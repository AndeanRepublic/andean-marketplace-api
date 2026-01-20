import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { CreateTextileProductDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileProductDto';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductMapper } from 'src/andean/infra/services/textileProducts/TextileProductMapper';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { TextileTypeRepository } from '../../datastore/textileProducts/TextileType.repo';
import { TextileSubcategoryRepository } from '../../datastore/textileProducts/TextileSubcategory.repo';
import { TextileStyleRepository } from '../../datastore/textileProducts/TextileStyle.repo';
import { TextilePrincipalUseRepository } from '../../datastore/textileProducts/TextilePrincipalUse.repo';
import { TextileCraftTechniqueRepository } from '../../datastore/textileProducts/TextileCraftTechnique.repo';
import { TextileCertificationRepository } from '../../datastore/textileProducts/TextileCertification.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { OriginProductCommunityRepository } from '../../datastore/originProductCommunity.repo';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { ColorOptionAlternativeRepository } from '../../datastore/textileProducts/ColorOptionAlternative.repo';
import { SizeOptionAlternativeRepository } from '../../datastore/textileProducts/SizeOptionAlternative.repo';

@Injectable()
export class CreateTextileProductUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(TextileCategoryRepository)
		private readonly textileCategoryRepository: TextileCategoryRepository,
		@Inject(TextileTypeRepository)
		private readonly textileTypeRepository: TextileTypeRepository,
		@Inject(TextileSubcategoryRepository)
		private readonly textileSubcategoryRepository: TextileSubcategoryRepository,
		@Inject(TextileStyleRepository)
		private readonly textileStyleRepository: TextileStyleRepository,
		@Inject(TextilePrincipalUseRepository)
		private readonly textilePrincipalUseRepository: TextilePrincipalUseRepository,
		@Inject(TextileCraftTechniqueRepository)
		private readonly textileCraftTechniqueRepository: TextileCraftTechniqueRepository,
		@Inject(TextileCertificationRepository)
		private readonly textileCertificationRepository: TextileCertificationRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(OriginProductCommunityRepository)
		private readonly originProductCommunityRepository: OriginProductCommunityRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
		@Inject(ColorOptionAlternativeRepository)
		private readonly colorOptionAlternativeRepository: ColorOptionAlternativeRepository,
		@Inject(SizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SizeOptionAlternativeRepository,
	) {}

	async handle(dto: CreateTextileProductDto): Promise<TextileProduct> {
		// Validar categoryId solo si existe
		if (dto.categoryId) {
			const categoryFound =
				await this.textileCategoryRepository.getCategoryById(dto.categoryId);
			if (!categoryFound) {
				throw new NotFoundException('TextileCategory not found');
			}
		}

		// Validar ownerId según ownerType
		if (dto.baseInfo.ownerType === OwnerType.SHOP) {
			const shopFound = await this.shopRepository.getById(dto.baseInfo.ownerId);
			if (!shopFound) {
				throw new NotFoundException('Shop not found');
			}
		}

		// Validate communityId according to ownerType
		if (dto.baseInfo.ownerType === OwnerType.COMMUNITY) {
			const communityFound = await this.communityRepository.getById(
				dto.baseInfo.ownerId,
			);
			if (!communityFound) {
				throw new NotFoundException('Community not found');
			}
		}

		// Validar detailTraceability solo si existe
		if (dto.detailTraceability) {
			// Validar originProductCommunityId solo si existe
			if (dto.detailTraceability.originProductCommunityId) {
				const originCommunityFound =
					await this.originProductCommunityRepository.getById(
						dto.detailTraceability.originProductCommunityId,
					);
				if (!originCommunityFound) {
					throw new NotFoundException('OriginProductCommunity not found');
				}
			}

			// Validar craftTechniqueId solo si existe
			if (dto.detailTraceability.craftTechniqueId) {
				const craftTechniqueFound =
					await this.textileCraftTechniqueRepository.getTextileCraftTechniqueById(
						dto.detailTraceability.craftTechniqueId,
					);
				if (!craftTechniqueFound) {
					throw new NotFoundException('TextileCraftTechnique not found');
				}
			}

			// Validar certificationId solo si existe
			if (dto.detailTraceability.certificationId) {
				const certificationFound =
					await this.textileCertificationRepository.getTextileCertificationById(
						dto.detailTraceability.certificationId,
					);
				if (!certificationFound) {
					throw new NotFoundException('TextileCertification not found');
				}
			}
		}

		// Validar atributos si existen
		if (dto.atribute) {
			// Validar textileTypeId solo si existe
			if (dto.atribute.textileTypeId) {
				const typeFound = await this.textileTypeRepository.getTextileTypeById(
					dto.atribute.textileTypeId,
				);
				if (!typeFound) {
					throw new NotFoundException('TextileType not found');
				}
			}

			// Validar subcategoryId solo si existe
			if (dto.atribute.subcategoryId) {
				const subcategoryFound =
					await this.textileSubcategoryRepository.getTextileSubcategoryById(
						dto.atribute.subcategoryId,
					);
				if (!subcategoryFound) {
					throw new NotFoundException('TextileSubcategory not found');
				}
			}

			// Validar textileStyleId solo si existe
			if (dto.atribute.textileStyleId) {
				const styleFound =
					await this.textileStyleRepository.getTextileStyleById(
						dto.atribute.textileStyleId,
					);
				if (!styleFound) {
					throw new NotFoundException('TextileStyle not found');
				}
			}

			// Validar principalUse (array) solo si existe y tiene elementos
			if (dto.atribute.principalUse && dto.atribute.principalUse.length > 0) {
				for (const principalUseId of dto.atribute.principalUse) {
					const principalUseFound =
						await this.textilePrincipalUseRepository.getTextilePrincipalUseById(
							principalUseId,
						);
					if (!principalUseFound) {
						throw new NotFoundException(
							`TextilePrincipalUse with id ${principalUseId} not found`,
						);
					}
				}
			}
		}

		// Validar options si existen
		if (dto.options && dto.options.length > 0) {
			for (const option of dto.options) {
				// Validar idOpcionAlternative en cada value según el name de la opción
				if (option.values && option.values.length > 0) {
					for (const value of option.values) {
						if (value.idOpcionAlternative) {
							if (option.name === 'color') {
								const colorOptionFound =
									await this.colorOptionAlternativeRepository.getById(
										value.idOpcionAlternative,
									);
								if (!colorOptionFound) {
									throw new NotFoundException(
										`ColorOptionAlternative with id ${value.idOpcionAlternative} not found`,
									);
								}
							} else if (option.name === 'size') {
								const sizeOptionFound =
									await this.sizeOptionAlternativeRepository.getById(
										value.idOpcionAlternative,
									);
								if (!sizeOptionFound) {
									throw new NotFoundException(
										`SizeOptionAlternative with id ${value.idOpcionAlternative} not found`,
									);
								}
							}
						}
					}
				}
			}
		}

		const textileProductToSave = TextileProductMapper.fromCreateDto(dto);
		return this.textileProductRepository.saveTextileProduct(
			textileProductToSave,
		);
	}
}
