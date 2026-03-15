import {
	Injectable,
	Inject,
	NotFoundException,
	BadRequestException,
	ForbiddenException,
} from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { UpdateSuperfoodDto } from '../../../infra/controllers/dto/superfoods/UpdateSuperfoodDto';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodProductMapper } from '../../../infra/services/superfood/SuperfoodProductMapper';
import { SuperfoodCategoryRepository } from '../../datastore/superfoods/SuperfoodCategory.repo';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SuperfoodOwnerType } from '../../../domain/enums/SuperfoodOwnerType';
import { instanceToPlain } from 'class-transformer';
import { CreateSuperfoodDto } from '../../../infra/controllers/dto/superfoods/CreateSuperfoodDto';
import { CreateDetailSourceProductUseCase } from '../detailSourceProduct/CreateDetailSourceProductUseCase';
import { UpdateDetailSourceProductUseCase } from '../detailSourceProduct/UpdateDetailSourceProductUseCase';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';

@Injectable()
export class UpdateSuperfoodProductUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(SuperfoodCategoryRepository)
		private readonly categoryRepository: SuperfoodCategoryRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,

		private readonly createDetailSourceProductUseCase: CreateDetailSourceProductUseCase,
		private readonly updateDetailSourceProductUseCase: UpdateDetailSourceProductUseCase,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
	) {}

	async handle(
		productId: string,
		dto: CreateSuperfoodDto,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<SuperfoodProduct> {
		// 1. Validar que el producto existe
		const existingProduct =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!existingProduct) {
			throw new NotFoundException(`Product with id ${productId} not found`);
		}

		// Ownership check
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			if (existingProduct.baseInfo.ownerType === SuperfoodOwnerType.COMMUNITY) {
				throw new ForbiddenException('You can only modify your own resource');
			}
			const seller =
				await this.sellerProfileRepository.getSellerByUserId(requestingUserId);
			if (!seller)
				throw new ForbiddenException('You can only modify your own resource');
			const shops = await this.shopRepository.getAllBySellerId(seller.id);
			const shopIds = shops.map((s) => s.id);
			if (!shopIds.includes(existingProduct.baseInfo.ownerId)) {
				throw new ForbiddenException('You can only modify your own resource');
			}
		}

		// 2. Validar categoryId solo si existe en el DTO
		if (dto.categoryId) {
			const categoryFound = await this.categoryRepository.getCategoryById(
				dto.categoryId,
			);
			if (!categoryFound) {
				throw new NotFoundException(
					`Category with id ${dto.categoryId} not found`,
				);
			}
		}

		// 3. Validar ownerId según ownerType solo si existe en el DTO
		if (dto.baseInfo?.ownerType === SuperfoodOwnerType.SHOP) {
			if (dto.baseInfo?.ownerId) {
				const shopFound = await this.shopRepository.getById(
					dto.baseInfo.ownerId,
				);
				if (!shopFound) {
					throw new NotFoundException(
						`Shop with id ${dto.baseInfo.ownerId} not found`,
					);
				}
			}
		} else if (dto.baseInfo?.ownerType === SuperfoodOwnerType.COMMUNITY) {
			if (dto.baseInfo?.ownerId) {
				const communityFound = await this.communityRepository.getById(
					dto.baseInfo.ownerId,
				);
				if (!communityFound) {
					throw new NotFoundException(
						`Community with ID ${dto.baseInfo.ownerId} not found`,
					);
				}
			}
		}

		// 4. Validaciones de negocio si se actualizan precios/stock
		if (
			dto.priceInventory?.basePrice !== undefined &&
			dto.priceInventory.basePrice <= 0
		) {
			throw new BadRequestException('The base price must be greater than 0');
		}

		if (
			dto.priceInventory?.totalStock !== undefined &&
			dto.priceInventory.totalStock < 0
		) {
			throw new BadRequestException('The total stock cannot be negative');
		}

		// 5. Manejar detailSourceProduct si viene en el DTO
		let detailSourceProductId = existingProduct.detailSourceProductId;
		if (dto.detailSourceProduct) {
			if (existingProduct.detailSourceProductId) {
				// Actualizar el DetailSourceProduct existente
				await this.updateDetailSourceProductUseCase.handle(
					existingProduct.detailSourceProductId,
					dto.detailSourceProduct,
				);
			} else {
				// Crear uno nuevo si no existe
				const created = await this.createDetailSourceProductUseCase.handle(
					dto.detailSourceProduct,
				);
				detailSourceProductId = created.id;
			}
		}

		// 6. Usar el mapper para crear la entidad actualizada
		const toUpdate = SuperfoodProductMapper.fromUpdateDto(productId, dto);
		if (detailSourceProductId) {
			toUpdate.detailSourceProductId = detailSourceProductId;
		}

		// 7. Guardar cambios
		return this.superfoodProductRepository.updateSuperfoodProduct(toUpdate);
	}
}
