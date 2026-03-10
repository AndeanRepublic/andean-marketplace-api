import type { CreateTextileProductDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileProductDto';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { TextileOptionName } from 'src/andean/domain/enums/TextileOptionName';
import { TextileProductStatus } from 'src/andean/domain/enums/TextileProductStatus';
import { Gender } from 'src/andean/domain/enums/Gender';
import { Season } from 'src/andean/domain/enums/Season';
import { ToolUsed } from 'src/andean/domain/enums/ToolUsed';

// --- IDs used across fixtures ---
export const FIXTURE_IDS = {
	shop: 'shop-123',
	community: 'community-456',
	category: 'category-ponchos-001',
	textileType: 'textile-type-001',
	textileStyle: 'textile-style-001',
	principalUse: 'principal-use-001',
	craftTechnique: 'craft-technique-001',
	certification: 'certification-001',
	originCommunity: 'origin-community-001',
	colorOptionAlternative: 'color-alt-001',
	sizeOptionAlternative: 'size-alt-001',
} as const;

// --- DTOs ---

export const minimalCreateTextileProductDto: CreateTextileProductDto = {
	status: TextileProductStatus.PUBLISHED,
	baseInfo: {
		title: 'Poncho Andino',
		mediaIds: ['media-1'],
		description: 'Poncho tradicional tejido a mano',
		ownerType: OwnerType.SHOP,
		ownerId: FIXTURE_IDS.shop,
	},
	priceInventary: { basePrice: 100, totalStock: 10 },
};

export const minimalCreateTextileProductDtoCommunity: CreateTextileProductDto = {
	...minimalCreateTextileProductDto,
	baseInfo: {
		...minimalCreateTextileProductDto.baseInfo,
		ownerType: OwnerType.COMMUNITY,
		ownerId: FIXTURE_IDS.community,
	},
};

export const fullCreateTextileProductDto: CreateTextileProductDto = {
	...minimalCreateTextileProductDto,
	categoryId: FIXTURE_IDS.category,
	detailTraceability: {
		originProductCommunityId: FIXTURE_IDS.originCommunity,
		craftTechniqueId: FIXTURE_IDS.craftTechnique,
		certificationId: FIXTURE_IDS.certification,
		isHandmade: true,
		toolUsed: ToolUsed.MANUAL,
	},
	atribute: {
		textileTypeId: FIXTURE_IDS.textileType,
		textileStyleId: FIXTURE_IDS.textileStyle,
		principalUse: [FIXTURE_IDS.principalUse],
		gender: Gender.UNISEX,
		season: Season.WINTER,
		preparationTime: { days: 5, hours: 4 },
	},
	options: [
		{
			name: TextileOptionName.COLOR,
			values: [
				{ label: 'Rojo Carmesí', idOpcionAlternative: FIXTURE_IDS.colorOptionAlternative },
			],
		},
		{
			name: TextileOptionName.SIZE,
			values: [
				{ label: 'M', idOpcionAlternative: FIXTURE_IDS.sizeOptionAlternative },
			],
		},
	],
};

export const fullCreateTextileProductDtoWithDuplicateOptionNames: CreateTextileProductDto =
	{
		...fullCreateTextileProductDto,
		options: [
			{
				name: TextileOptionName.COLOR,
				values: [{ label: 'Rojo', idOpcionAlternative: FIXTURE_IDS.colorOptionAlternative }],
			},
			{
				name: TextileOptionName.COLOR,
				values: [{ label: 'Azul', idOpcionAlternative: FIXTURE_IDS.colorOptionAlternative }],
			},
		],
	};

export const fullCreateTextileProductDtoWithDuplicateLabels: CreateTextileProductDto =
	{
		...fullCreateTextileProductDto,
		options: [
			{
				name: TextileOptionName.COLOR,
				values: [
					{ label: 'Rojo', idOpcionAlternative: FIXTURE_IDS.colorOptionAlternative },
					{ label: 'Rojo', idOpcionAlternative: FIXTURE_IDS.colorOptionAlternative },
				],
			},
		],
	};

// --- Mock entities (minimal objects for validation to pass) ---

export const mockShop = { id: FIXTURE_IDS.shop, name: 'Tienda Andina' };
export const mockCommunity = { id: FIXTURE_IDS.community, name: 'Comunidad Cusco' };
export const mockCategory = { id: FIXTURE_IDS.category, name: 'Ponchos' };
export const mockTextileType = { id: FIXTURE_IDS.textileType, name: 'Lana de Alpaca' };
export const mockTextileStyle = { id: FIXTURE_IDS.textileStyle, name: 'Tradicional' };
export const mockPrincipalUse = { id: FIXTURE_IDS.principalUse, name: 'Casual' };
export const mockCraftTechnique = { id: FIXTURE_IDS.craftTechnique, name: 'Telar' };
export const mockCertification = { id: FIXTURE_IDS.certification, name: 'Fair Trade' };
export const mockOriginCommunity = {
	id: FIXTURE_IDS.originCommunity,
	name: 'Comunidad de origen',
};
export const mockColorOptionAlternative = {
	id: FIXTURE_IDS.colorOptionAlternative,
	nameLabel: 'Rojo',
	hexCode: '#FF0000',
};
export const mockSizeOptionAlternative = {
	id: FIXTURE_IDS.sizeOptionAlternative,
	nameLabel: 'M',
};

// --- Saved product (for saveTextileProduct mock) ---

export const mockSavedTextileProduct = {
	id: 'product-saved-001',
	status: TextileProductStatus.PUBLISHED,
	baseInfo: minimalCreateTextileProductDto.baseInfo,
	priceInventary: minimalCreateTextileProductDto.priceInventary,
};
