import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileProductUseCase';
import { TextileProductRepository } from 'src/andean/app/datastore/textileProducts/TextileProduct.repo';
import { TextileCategoryRepository } from 'src/andean/app/datastore/textileProducts/TextileCategory.repo';
import { TextileTypeRepository } from 'src/andean/app/datastore/textileProducts/TextileType.repo';
import { TextileStyleRepository } from 'src/andean/app/datastore/textileProducts/TextileStyle.repo';
import { TextilePrincipalUseRepository } from 'src/andean/app/datastore/textileProducts/TextilePrincipalUse.repo';
import { TextileCraftTechniqueRepository } from 'src/andean/app/datastore/textileProducts/TextileCraftTechnique.repo';
import { TextileCertificationRepository } from 'src/andean/app/datastore/textileProducts/TextileCertification.repo';
import { ShopRepository } from 'src/andean/app/datastore/Shop.repo';
import { OriginProductCommunityRepository } from 'src/andean/app/datastore/originProductCommunity.repo';
import { CommunityRepository } from 'src/andean/app/datastore/community/community.repo';
import { ColorOptionAlternativeRepository } from 'src/andean/app/datastore/textileProducts/ColorOptionAlternative.repo';
import { SizeOptionAlternativeRepository } from 'src/andean/app/datastore/textileProducts/SizeOptionAlternative.repo';
import {
	FIXTURE_IDS,
	minimalCreateTextileProductDto,
	minimalCreateTextileProductDtoCommunity,
	fullCreateTextileProductDto,
	fullCreateTextileProductDtoWithDuplicateOptionNames,
	fullCreateTextileProductDtoWithDuplicateLabels,
	mockShop,
	mockCommunity,
	mockCategory,
	mockTextileType,
	mockTextileStyle,
	mockPrincipalUse,
	mockCraftTechnique,
	mockCertification,
	mockOriginCommunity,
	mockColorOptionAlternative,
	mockSizeOptionAlternative,
	mockSavedTextileProduct,
} from '../../../../../fixtures/createTextileProduct.fixtures';

describe('CreateTextileProductUseCase', () => {
	let useCase: CreateTextileProductUseCase;
	let mocks: {
		textileProductRepo: { saveTextileProduct: jest.Mock };
		textileCategoryRepo: { getCategoryById: jest.Mock };
		textileTypeRepo: { getTextileTypeById: jest.Mock };
		textileStyleRepo: { getTextileStyleById: jest.Mock };
		textilePrincipalUseRepo: { getTextilePrincipalUseById: jest.Mock };
		textileCraftTechniqueRepo: { getTextileCraftTechniqueById: jest.Mock };
		textileCertificationRepo: { getTextileCertificationById: jest.Mock };
		shopRepo: { getById: jest.Mock };
		originProductCommunityRepo: { getById: jest.Mock };
		communityRepo: { getById: jest.Mock };
		colorOptionAlternativeRepo: { getById: jest.Mock };
		sizeOptionAlternativeRepo: { getById: jest.Mock };
	};

	beforeEach(async () => {
		mocks = {
			textileProductRepo: {
				saveTextileProduct: jest.fn().mockResolvedValue(mockSavedTextileProduct),
			},
			textileCategoryRepo: {
				getCategoryById: jest.fn().mockResolvedValue(mockCategory),
			},
			textileTypeRepo: {
				getTextileTypeById: jest.fn().mockResolvedValue(mockTextileType),
			},
			textileStyleRepo: {
				getTextileStyleById: jest.fn().mockResolvedValue(mockTextileStyle),
			},
			textilePrincipalUseRepo: {
				getTextilePrincipalUseById: jest.fn().mockResolvedValue(mockPrincipalUse),
			},
			textileCraftTechniqueRepo: {
				getTextileCraftTechniqueById: jest
					.fn()
					.mockResolvedValue(mockCraftTechnique),
			},
			textileCertificationRepo: {
				getTextileCertificationById: jest
					.fn()
					.mockResolvedValue(mockCertification),
			},
			shopRepo: { getById: jest.fn().mockResolvedValue(mockShop) },
			originProductCommunityRepo: {
				getById: jest.fn().mockResolvedValue(mockOriginCommunity),
			},
			communityRepo: { getById: jest.fn().mockResolvedValue(mockCommunity) },
			colorOptionAlternativeRepo: {
				getById: jest.fn().mockResolvedValue(mockColorOptionAlternative),
			},
			sizeOptionAlternativeRepo: {
				getById: jest.fn().mockResolvedValue(mockSizeOptionAlternative),
			},
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateTextileProductUseCase,
				{ provide: TextileProductRepository, useValue: mocks.textileProductRepo },
				{
					provide: TextileCategoryRepository,
					useValue: mocks.textileCategoryRepo,
				},
				{ provide: TextileTypeRepository, useValue: mocks.textileTypeRepo },
				{ provide: TextileStyleRepository, useValue: mocks.textileStyleRepo },
				{
					provide: TextilePrincipalUseRepository,
					useValue: mocks.textilePrincipalUseRepo,
				},
				{
					provide: TextileCraftTechniqueRepository,
					useValue: mocks.textileCraftTechniqueRepo,
				},
				{
					provide: TextileCertificationRepository,
					useValue: mocks.textileCertificationRepo,
				},
				{ provide: ShopRepository, useValue: mocks.shopRepo },
				{
					provide: OriginProductCommunityRepository,
					useValue: mocks.originProductCommunityRepo,
				},
				{ provide: CommunityRepository, useValue: mocks.communityRepo },
				{
					provide: ColorOptionAlternativeRepository,
					useValue: mocks.colorOptionAlternativeRepo,
				},
				{
					provide: SizeOptionAlternativeRepository,
					useValue: mocks.sizeOptionAlternativeRepo,
				},
			],
		}).compile();

		useCase = module.get(CreateTextileProductUseCase);
	});

	describe('success', () => {
		it('creates product with minimal DTO (SHOP owner)', async () => {
			const result = await useCase.handle(minimalCreateTextileProductDto);

			expect(result).toEqual(mockSavedTextileProduct);
			expect(mocks.shopRepo.getById).toHaveBeenCalledWith(FIXTURE_IDS.shop);
			expect(mocks.textileProductRepo.saveTextileProduct).toHaveBeenCalled();
		});

		it('creates product with minimal DTO (COMMUNITY owner)', async () => {
			const result = await useCase.handle(minimalCreateTextileProductDtoCommunity);

			expect(result).toEqual(mockSavedTextileProduct);
			expect(mocks.communityRepo.getById).toHaveBeenCalledWith(FIXTURE_IDS.community);
			expect(mocks.textileProductRepo.saveTextileProduct).toHaveBeenCalled();
		});

		it('creates product with full DTO', async () => {
			const result = await useCase.handle(fullCreateTextileProductDto);

			expect(result).toEqual(mockSavedTextileProduct);
			expect(mocks.textileCategoryRepo.getCategoryById).toHaveBeenCalledWith(
				FIXTURE_IDS.category,
			);
			expect(mocks.textileProductRepo.saveTextileProduct).toHaveBeenCalled();
		});
	});

	describe('NotFoundException', () => {
		it('throws when categoryId is invalid', async () => {
			mocks.textileCategoryRepo.getCategoryById.mockResolvedValue(null);

			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				NotFoundException,
			);
			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				'TextileCategory not found',
			);
		});

		it('throws when Shop not found', async () => {
			mocks.shopRepo.getById.mockResolvedValue(null);

			await expect(useCase.handle(minimalCreateTextileProductDto)).rejects.toThrow(
				NotFoundException,
			);
			await expect(useCase.handle(minimalCreateTextileProductDto)).rejects.toThrow(
				'Shop not found',
			);
		});

		it('throws when Community not found', async () => {
			mocks.communityRepo.getById.mockResolvedValue(null);

			await expect(
				useCase.handle(minimalCreateTextileProductDtoCommunity),
			).rejects.toThrow(NotFoundException);
			await expect(
				useCase.handle(minimalCreateTextileProductDtoCommunity),
			).rejects.toThrow('Community not found');
		});

		it('throws when OriginProductCommunity not found', async () => {
			mocks.originProductCommunityRepo.getById.mockResolvedValue(null);

			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				NotFoundException,
			);
			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				'OriginProductCommunity not found',
			);
		});

		it('throws when TextileCraftTechnique not found', async () => {
			mocks.textileCraftTechniqueRepo.getTextileCraftTechniqueById.mockResolvedValue(
				null,
			);

			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				NotFoundException,
			);
			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				'TextileCraftTechnique not found',
			);
		});

		it('throws when TextileCertification not found', async () => {
			mocks.textileCertificationRepo.getTextileCertificationById.mockResolvedValue(
				null,
			);

			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				NotFoundException,
			);
			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				'TextileCertification not found',
			);
		});

		it('throws when TextileType not found', async () => {
			mocks.textileTypeRepo.getTextileTypeById.mockResolvedValue(null);

			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				NotFoundException,
			);
			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				'TextileType not found',
			);
		});

		it('throws when TextileStyle not found', async () => {
			mocks.textileStyleRepo.getTextileStyleById.mockResolvedValue(null);

			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				NotFoundException,
			);
			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				'TextileStyle not found',
			);
		});

		it('throws when TextilePrincipalUse not found', async () => {
			mocks.textilePrincipalUseRepo.getTextilePrincipalUseById.mockResolvedValue(
				null,
			);

			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				NotFoundException,
			);
			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				`TextilePrincipalUse with id ${FIXTURE_IDS.principalUse} not found`,
			);
		});

		it('throws when ColorOptionAlternative not found', async () => {
			mocks.colorOptionAlternativeRepo.getById.mockResolvedValue(null);

			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				NotFoundException,
			);
			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				`ColorOptionAlternative with id ${FIXTURE_IDS.colorOptionAlternative} not found`,
			);
		});

		it('throws when SizeOptionAlternative not found', async () => {
			mocks.sizeOptionAlternativeRepo.getById.mockResolvedValue(null);

			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				NotFoundException,
			);
			await expect(useCase.handle(fullCreateTextileProductDto)).rejects.toThrow(
				`SizeOptionAlternative with id ${FIXTURE_IDS.sizeOptionAlternative} not found`,
			);
		});
	});

	describe('BadRequestException', () => {
		it('throws when duplicate option names', async () => {
			await expect(
				useCase.handle(fullCreateTextileProductDtoWithDuplicateOptionNames),
			).rejects.toThrow(BadRequestException);
			await expect(
				useCase.handle(fullCreateTextileProductDtoWithDuplicateOptionNames),
			).rejects.toThrow('Duplicate option names are not allowed');
		});

		it('throws when duplicate labels in option', async () => {
			await expect(
				useCase.handle(fullCreateTextileProductDtoWithDuplicateLabels),
			).rejects.toThrow(BadRequestException);
			await expect(
				useCase.handle(fullCreateTextileProductDtoWithDuplicateLabels),
			).rejects.toThrow('Duplicate labels in option COLOR are not allowed');
		});
	});
});
