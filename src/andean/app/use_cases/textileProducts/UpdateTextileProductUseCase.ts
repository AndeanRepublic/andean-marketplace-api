import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductMapper } from 'src/andean/infra/services/textileProducts/TextileProductMapper';
import { CreateTextileProductDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileProductDto';
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
import { CommunityRepository } from '../../datastore/community.repo';

@Injectable()
export class UpdateTextileProductUseCase {
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
  ) {}

  async handle(
    id: string,
    dto: CreateTextileProductDto,
  ): Promise<TextileProduct> {
    const productFound =
      await this.textileProductRepository.getTextileProductById(id);
    if (!productFound) {
      throw new NotFoundException('Textile product not found');
    }

    // Validate categoryId
    const categoryFound = await this.textileCategoryRepository.getCategoryById(
      dto.categoryId,
    );
    if (!categoryFound) {
      throw new NotFoundException('TextileCategory not found');
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
      const communityFound = await this.communityRepository.findById(
        dto.baseInfo.ownerId,
      );
      if (!communityFound) {
        throw new NotFoundException('Community not found');
      }
    }

    // Validate detailTraceability.originProductCommunityId
    const originCommunityFound =
      await this.originProductCommunityRepository.findById(
        dto.detailTraceability.originProductCommunityId,
      );
    if (!originCommunityFound) {
      throw new NotFoundException('OriginProductCommunity not found');
    }

    // Validate detailTraceability.craftTechniqueId
    const craftTechniqueFound =
      await this.textileCraftTechniqueRepository.getTextileCraftTechniqueById(
        dto.detailTraceability.craftTechniqueId,
      );
    if (!craftTechniqueFound) {
      throw new NotFoundException('TextileCraftTechnique not found');
    }

    // Validate detailTraceability.certificationId
    const certificationFound =
      await this.textileCertificationRepository.getTextileCertificationById(
        dto.detailTraceability.certificationId,
      );
    if (!certificationFound) {
      throw new NotFoundException('TextileCertification not found');
    }

    // Validate attributes if they exist
    if (dto.atribute) {
      // Validate textileTypeId
      const typeFound = await this.textileTypeRepository.getTextileTypeById(
        dto.atribute.textileTypeId,
      );
      if (!typeFound) {
        throw new NotFoundException('TextileType not found');
      }

      // Validate subcategoryId
      const subcategoryFound =
        await this.textileSubcategoryRepository.getTextileSubcategoryById(
          dto.atribute.subcategoryId,
        );
      if (!subcategoryFound) {
        throw new NotFoundException('TextileSubcategory not found');
      }

      // Validate textileStyleId
      const styleFound = await this.textileStyleRepository.getTextileStyleById(
        dto.atribute.textileStyleId,
      );
      if (!styleFound) {
        throw new NotFoundException('TextileStyle not found');
      }

      // Validate principalUse (array)
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

    const toUpdate = TextileProductMapper.fromUpdateDto(id, dto);
    return this.textileProductRepository.updateTextileProduct(id, toUpdate);
  }
}
