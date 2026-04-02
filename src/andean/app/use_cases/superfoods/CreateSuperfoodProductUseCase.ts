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
import { CreateDetailSourceProductUseCase } from '../detailSourceProduct/CreateDetailSourceProductUseCase';
import { SuperfoodColorRepository } from '../../datastore/superfoods/SuperfoodColor.repo';

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

		@Inject(SuperfoodColorRepository)
		private readonly superfoodColorRepository: SuperfoodColorRepository,

		private readonly createDetailSourceProductUseCase: CreateDetailSourceProductUseCase,
	) {}

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
				throw new NotFoundException(
					`Shop with ID ${dto.baseInfo.ownerId} not found`,
				);
			}
		} else if (dto.baseInfo.ownerType === SuperfoodOwnerType.COMMUNITY) {
			const communityFound = await this.communityRepository.getById(
				dto.baseInfo.ownerId,
			);
			if (!communityFound) {
				throw new NotFoundException(
					`Community with ID ${dto.baseInfo.ownerId} not found`,
				);
			}
		}

		// 3. Color de catálogo (referencia por ID)
		if (dto.colorId?.trim()) {
			const colorId = dto.colorId.trim();
			const color = await this.superfoodColorRepository.getById(colorId);
			if (!color) {
				throw new BadRequestException(
					`Superfood color with id ${colorId} not found`,
				);
			}
		}

		// 4. Si viene detailSourceProduct, crearlo primero
		let detailSourceProductId: string | undefined;
		if (dto.detailSourceProduct) {
			const createdDetailSource =
				await this.createDetailSourceProductUseCase.handle(
					dto.detailSourceProduct,
				);
			detailSourceProductId = createdDetailSource.id;
		}

		// 5. Mapear DTO a entidad de dominio
		const productToSave = SuperfoodProductMapper.fromCreateDto(dto);
		if (detailSourceProductId) {
			productToSave.detailSourceProductId = detailSourceProductId;
		}

		// 6. Guardar en base de datos
		return this.superfoodProductRepository.saveSuperfoodProduct(productToSave);
	}
}
