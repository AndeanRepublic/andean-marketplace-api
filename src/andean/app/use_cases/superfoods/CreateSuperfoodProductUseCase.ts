import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SuperfoodCategoryRepository } from '../../datastore/superfoods/SuperfoodCategory.repo';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { CreateSuperfoodDto } from '../../../infra/controllers/dto/superfoods/CreateSuperfoodDto';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodProductMapper } from '../../../infra/services/superfood/SuperfoodProductMapper';
import { SuperfoodOwnerType } from '../../../domain/enums/SuperfoodOwnerType';

@Injectable()
export class CreateSuperfoodProductUseCase {
  constructor(
    @Inject(SuperfoodProductRepository)
    private readonly superfoodProductRepository: SuperfoodProductRepository,

    @Inject(ShopRepository)
    private readonly shopRepository: ShopRepository,

		@Inject(SuperfoodCategoryRepository)
		private readonly categoryRepository: SuperfoodCategoryRepository,

		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
	) { }

  async handle(dto: CreateSuperfoodDto): Promise<SuperfoodProduct> {
    // 1. Validar que la categoría existe solo si se proporciona
    if (dto.categoryId) {
      const categoryFound = await this.categoryRepository.getCategoryById(
        dto.categoryId,
      );
      if (!categoryFound) {
        throw new NotFoundException(
          `Categoría con ID ${dto.categoryId} no encontrada`,
        );
      }
    }

		// 2. Validar que el owner existe (shop o community)
		if (dto.baseInfo.ownerType === SuperfoodOwnerType.SHOP) {
			const shopFound = await this.shopRepository.getById(dto.baseInfo.ownerId);
			if (!shopFound) {
				throw new NotFoundException(`Shop with ID ${dto.baseInfo.ownerId} not found`);
			}
		} else if (dto.baseInfo.ownerType === SuperfoodOwnerType.COMMUNITY) {
			const communityFound = await this.communityRepository.getById(dto.baseInfo.ownerId);
			if (!communityFound) {
				throw new NotFoundException(`Community with ID ${dto.baseInfo.ownerId} not found`);
			}
		}

		// 3. Mapear DTO a entidad de dominio
		const productToSave = SuperfoodProductMapper.fromCreateDto(dto);

		// 4. Guardar en base de datos
		return this.superfoodProductRepository.saveSuperfoodProduct(productToSave);
	}
}
