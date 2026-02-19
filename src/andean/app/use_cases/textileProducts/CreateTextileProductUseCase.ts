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
import { TextileStyleRepository } from '../../datastore/textileProducts/TextileStyle.repo';
import { TextilePrincipalUseRepository } from '../../datastore/textileProducts/TextilePrincipalUse.repo';
import { TextileCraftTechniqueRepository } from '../../datastore/textileProducts/TextileCraftTechnique.repo';
import { TextileCertificationRepository } from '../../datastore/textileProducts/TextileCertification.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { OriginProductCommunityRepository } from '../../datastore/originProductCommunity.repo';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { TextileOptionName } from 'src/andean/domain/enums/TextileOptionName';
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
		// Validate categoryId if it exists
		if (dto.categoryId) {
			const categoryFound =
				await this.textileCategoryRepository.getCategoryById(dto.categoryId);
			if (!categoryFound) {
				throw new NotFoundException('TextileCategory not found');
			}
		}

		// Validate ownerId according to ownerType
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

		// Validate detailTraceability if it exists
		if (dto.detailTraceability) {
			// Validate originProductCommunityId if it exists
			if (dto.detailTraceability.originProductCommunityId) {
				const originCommunityFound =
					await this.originProductCommunityRepository.getById(
						dto.detailTraceability.originProductCommunityId,
					);
				if (!originCommunityFound) {
					throw new NotFoundException('OriginProductCommunity not found');
				}
			}

			// Validate craftTechniqueId if it exists
			if (dto.detailTraceability.craftTechniqueId) {
				const craftTechniqueFound =
					await this.textileCraftTechniqueRepository.getTextileCraftTechniqueById(
						dto.detailTraceability.craftTechniqueId,
					);
				if (!craftTechniqueFound) {
					throw new NotFoundException('TextileCraftTechnique not found');
				}
			}

			// Validate certificationId if it exists
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

		// Validate attributes if they exist
		if (dto.atribute) {
			// Validate textileTypeId if it exists
			if (dto.atribute.textileTypeId) {
				const typeFound = await this.textileTypeRepository.getTextileTypeById(
					dto.atribute.textileTypeId,
				);
				if (!typeFound) {
					throw new NotFoundException('TextileType not found');
				}
			}

			// Validate textileStyleId if it exists
			if (dto.atribute.textileStyleId) {
				const styleFound =
					await this.textileStyleRepository.getTextileStyleById(
						dto.atribute.textileStyleId,
					);
				if (!styleFound) {
					throw new NotFoundException('TextileStyle not found');
				}
			}

			// Validate principalUse (array) if it exists and has elements
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

		// Validate options if they exist
		if (dto.options && dto.options.length > 0) {
			// Validate that there are no duplicate options by name
			const optionNames = dto.options.map((opt) => opt.name);
			const uniqueOptionNames = new Set(optionNames);
			if (optionNames.length !== uniqueOptionNames.size) {
				throw new BadRequestException('Duplicate option names are not allowed');
			}

			for (const option of dto.options) {
				// Validate idOpcionAlternative in each value according to the name of the option
				if (option.values && option.values.length > 0) {
					// Validar que no haya labels duplicados en la misma opción
					const labels = option.values.map((v) => v.label);
					const uniqueLabels = new Set(labels);
					if (labels.length !== uniqueLabels.size) {
						throw new BadRequestException(
							`Duplicate labels in option ${option.name} are not allowed`,
						);
					}

					for (const value of option.values) {
						if (value.idOpcionAlternative) {
							if (option.name === TextileOptionName.COLOR) {
								const colorOptionFound =
									await this.colorOptionAlternativeRepository.getById(
										value.idOpcionAlternative,
									);
								if (!colorOptionFound) {
									throw new NotFoundException(
										`ColorOptionAlternative with id ${value.idOpcionAlternative} not found`,
									);
								}
							} else if (option.name === TextileOptionName.SIZE) {
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
