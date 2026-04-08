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
import { OwnerType } from '../../../domain/enums/OwnerType';
import { CreateDetailSourceProductUseCase } from '../detailSourceProduct/CreateDetailSourceProductUseCase';
import { SuperfoodColorRepository } from '../../datastore/superfoods/SuperfoodColor.repo';
import { SuperfoodCertificationRepository } from '../../datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodPreservationMethodRepository } from '../../datastore/superfoods/SuperfoodPreservationMethod.repo';
import { DetailSourceProductRepository } from '../../datastore/DetailSourceProduct.repo';
import { SuperfoodOptionName } from '../../../domain/enums/SuperfoodOptionName';
import { SuperfoodSizeOptionAlternativeRepository } from '../../datastore/superfoods/SuperfoodSizeOptionAlternative.repo';
import { SuperfoodSizeOptionAlternativeMapper } from '../../../infra/services/superfood/SuperfoodSizeOptionAlternativeMapper';
import { VariantRepository } from '../../datastore/Variant.repo';
import { VariantMapper } from '../../../infra/services/VariantMapper';
import { ProductType } from '../../../domain/enums/ProductType';

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

		@Inject(SuperfoodCertificationRepository)
		private readonly superfoodCertificationRepository: SuperfoodCertificationRepository,

		@Inject(SuperfoodPreservationMethodRepository)
		private readonly superfoodPreservationMethodRepository: SuperfoodPreservationMethodRepository,

		@Inject(DetailSourceProductRepository)
		private readonly detailSourceProductRepository: DetailSourceProductRepository,
		@Inject(SuperfoodSizeOptionAlternativeRepository)
		private readonly superfoodSizeOptionAlternativeRepository: SuperfoodSizeOptionAlternativeRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,

		private readonly createDetailSourceProductUseCase: CreateDetailSourceProductUseCase,
	) {}

	private async validateDetailTraceability(
		dto: CreateSuperfoodDto['detailTraceability'],
	): Promise<void> {
		if (!dto) return;
		const pm = dto.preservationMethodId?.trim();
		if (pm) {
			const m = await this.superfoodPreservationMethodRepository.getById(pm);
			if (!m) {
				throw new NotFoundException(
					`SuperfoodPreservationMethod with id ${pm} not found`,
				);
			}
		}
		const speciesId = dto.exactSpeciesOrVarietyId?.trim();
		if (speciesId) {
			const dsp = await this.detailSourceProductRepository.getById(speciesId);
			if (!dsp) {
				throw new NotFoundException(
					`DetailSourceProduct with id ${speciesId} not found`,
				);
			}
		}
		if (dto.certificationIds?.length) {
			for (const rawId of dto.certificationIds) {
				const id = rawId?.trim();
				if (!id) continue;
				const c = await this.superfoodCertificationRepository.getById(id);
				if (!c) {
					throw new NotFoundException(
						`SuperfoodCertification with id ${id} not found`,
					);
				}
			}
		}
	}

	private validateOptions(dto: CreateSuperfoodDto): void {
		if (!dto.options?.length) return;
		const optionNames = dto.options.map((opt) => opt.name);
		const uniqueOptionNames = new Set(optionNames);
		if (optionNames.length !== uniqueOptionNames.size) {
			throw new BadRequestException('Duplicate option names are not allowed');
		}

		for (const option of dto.options) {
			const labels = option.values.map((v) => v.label);
			const uniqueLabels = new Set(labels);
			if (labels.length !== uniqueLabels.size) {
				throw new BadRequestException(
					`Duplicate labels in option ${option.name} are not allowed`,
				);
			}

			if (option.name === SuperfoodOptionName.SIZE) {
				for (const value of option.values) {
					if (
						typeof value.sizeNumber !== 'number' ||
						!value.sizeUnit ||
						typeof value.servingsPerContainer !== 'number' ||
						typeof value.price !== 'number' ||
						typeof value.stock !== 'number'
					) {
						throw new BadRequestException(
							'Each SIZE option value requires sizeNumber, sizeUnit, servingsPerContainer, price, and stock',
						);
					}
				}
			}
		}
	}

	private async createSizeAlternativesForOptions(
		dto: CreateSuperfoodDto,
	): Promise<void> {
		if (!dto.options?.length) return;
		for (const option of dto.options) {
			if (option.name !== SuperfoodOptionName.SIZE || !option.values.length) {
				continue;
			}
			const created =
				await this.superfoodSizeOptionAlternativeRepository.createMany(
					option.values.map((value) =>
						SuperfoodSizeOptionAlternativeMapper.fromInput({
							sizeNumber: value.sizeNumber!,
							sizeUnit: value.sizeUnit!,
							servingsPerContainer: value.servingsPerContainer!,
						}),
					),
				);
			option.values = option.values.map((value, idx) => ({
				...value,
				idOptionAlternative: created[idx]?.id,
				label: created[idx]?.nameLabel ?? value.label,
			}));
		}
	}

	private async createVariantsForSizeOptions(
		productId: string,
		dto: CreateSuperfoodDto,
	): Promise<void> {
		const sizeOptions =
			dto.options?.filter(
				(option) => option.name === SuperfoodOptionName.SIZE,
			) ?? [];
		if (!sizeOptions.length) return;

		const variants = sizeOptions.flatMap((option) =>
			option.values
				.filter((value) => value.idOptionAlternative)
				.map((value) =>
					VariantMapper.fromCreateDto({
						productId,
						productType: ProductType.SUPERFOOD,
						combination: { SIZE: value.idOptionAlternative! },
						price: value.price!,
						stock: value.stock!,
						sku: value.sku,
					}),
				),
		);

		if (!variants.length) return;
		await this.variantRepository.createMany(variants);
	}

	async handle(dto: CreateSuperfoodDto): Promise<SuperfoodProduct> {
		// 1. Validar que la categoría existe
		const categoryFound = await this.categoryRepository.getCategoryById(
			dto.categoryId,
		);
		if (!categoryFound) {
			throw new NotFoundException(
				`Categoría con ID ${dto.categoryId} no encontrada`,
			);
		}

		// 2. Validar que el owner existe (shop o community)
		if (dto.baseInfo.ownerType === OwnerType.SHOP) {
			const shopFound = await this.shopRepository.getById(dto.baseInfo.ownerId);
			if (!shopFound) {
				throw new NotFoundException(
					`Shop with ID ${dto.baseInfo.ownerId} not found`,
				);
			}
		} else if (dto.baseInfo.ownerType === OwnerType.COMMUNITY) {
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
		const colorId = dto.colorId.trim();
		const color = await this.superfoodColorRepository.getById(colorId);
		if (!color) {
			throw new BadRequestException(
				`Superfood color with id ${colorId} not found`,
			);
		}

		await this.validateDetailTraceability(dto.detailTraceability);
		this.validateOptions(dto);
		await this.createSizeAlternativesForOptions(dto);

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
		const savedProduct =
			await this.superfoodProductRepository.saveSuperfoodProduct(productToSave);
		await this.createVariantsForSizeOptions(savedProduct.id, dto);
		return savedProduct;
	}
}
