/**
 * Typed interfaces for all e2e test fixtures.
 * These match the shape of JSON files in test/fixtures/.
 */

// ─── Shared ─────────────────────────────────────────────────────────────────

export interface TimestampedEntity {
	id: string;
	createdAt: string;
	updatedAt: string;
}

// ─── Box ────────────────────────────────────────────────────────────────────

export interface BoxProductFixture {
	productType: string;
	productId?: string;
	variantId?: string;
}

export interface BoxEntityFixture extends TimestampedEntity {
	title: string;
	subtitle: string;
	description: string;
	thumbnailImageId: string;
	mainImageId: string;
	products: BoxProductFixture[];
	price: number;
	sealIds: string[];
}

export interface BoxRelatedSuperfoodFixture {
	id: string;
	baseInfo: {
		title: string;
		ownerId: string;
		ownerType: string;
		mediaIds: string[];
	};
	priceInventory: { basePrice: number; totalStock: number };
	communityName: string;
}

export interface BoxRelatedTextileFixture {
	variantId: string;
	productId: string;
	product: {
		id: string;
		baseInfo: {
			title: string;
			ownerId: string;
			ownerType: string;
			mediaIds: string[];
		};
	};
	variant: {
		id: string;
		price: number;
		stock: number;
		combination: Record<string, string>;
	};
	communityName: string;
}

export interface BoxFixture {
	entity: BoxEntityFixture;
	createDto: Omit<BoxEntityFixture, 'id' | 'createdAt' | 'updatedAt'>;
	updateDto: Partial<Pick<BoxEntityFixture, 'title' | 'price'>>;
	invalidDto: Record<string, unknown>;
	mediaItems: Record<string, unknown>;
	relatedProducts: {
		superfoods: BoxRelatedSuperfoodFixture[];
		textiles: BoxRelatedTextileFixture[];
		thumbnailImages: Record<string, { url: string; name: string }>;
	};
	listResponse: Record<string, unknown>;
	detailResponse: Record<string, unknown>;
}

// ─── BoxSeal ────────────────────────────────────────────────────────────────

export interface BoxSealEntityFixture extends TimestampedEntity {
	name: string;
	description: string;
	logoMediaId: string;
}

export interface BoxSealFixture {
	entity: BoxSealEntityFixture;
	createDto: Omit<BoxSealEntityFixture, 'id' | 'createdAt' | 'updatedAt'>;
	updateDto: Partial<Pick<BoxSealEntityFixture, 'name' | 'description'>>;
	additionalEntities: BoxSealEntityFixture[];
}

// ─── Order ──────────────────────────────────────────────────────────────────

export interface OrderItemFixture {
	productId: string;
	productType: string;
	name: string;
	quantity: number;
	unitPrice: number;
	discount: number;
	totalPrice: number;
	color?: string;
	size?: string;
	material?: string;
	sku?: string;
}

export interface OrderPricingFixture {
	subtotal: number;
	discount: number;
	deliveryCost: number;
	taxOrFee: number;
	totalAmount: number;
	currency: string;
}

export interface OrderShippingInfoFixture {
	recipientName: string;
	phone: string;
	countryCode: string;
	country: string;
	city?: string;
	administrativeArea: Record<string, string>;
	addressLine1: string;
	addressLine2?: string;
	postalCode?: string;
}

export interface OrderPaymentFixture {
	method: string;
	provider?: string;
	transactionId?: string;
	paidAt?: string;
}

export interface OrderEntityFixture extends TimestampedEntity {
	customerId: string;
	customerEmail: string;
	status: string;
	items: OrderItemFixture[];
	pricing: OrderPricingFixture;
	shippingInfo: OrderShippingInfoFixture;
	payment: OrderPaymentFixture;
	deliveryOption: string;
}

export interface OrderFixture {
	entity: OrderEntityFixture;
	createDto: Omit<OrderEntityFixture, 'id' | 'createdAt' | 'updatedAt'>;
	createFromCartDto: {
		shippingInfo: OrderShippingInfoFixture;
		payment: OrderPaymentFixture;
		currency: string;
		deliveryOption: string;
	};
	updateDto: { status: string };
	invalidCreateDto: Record<string, unknown>;
	invalidUpdateDto: Record<string, unknown>;
	orderList: OrderEntityFixture[];
	updatedEntity: OrderEntityFixture;
}

// ─── Review ─────────────────────────────────────────────────────────────────

export interface ReviewEntityFixture extends TimestampedEntity {
	content: string;
	numberStarts: number;
	customerId: string;
	productId: string;
	productType: string;
	numberLikes: number;
	numberDislikes: number;
	mediaId?: string;
}

export interface ReviewCreateDtoFixture {
	content: string;
	numberStarts: number;
	customerId: string;
	productId: string;
	productType: string;
	mediaType?: string;
	mediaName?: string;
	mediaRole?: string;
}

export interface MediaItemEntityFixture extends TimestampedEntity {
	type: string;
	name: string;
	key: string;
	role: string;
	url?: string;
}

export interface ReviewFixture {
	entity: ReviewEntityFixture;
	createDto: ReviewCreateDtoFixture;
	createDtoWithMedia: ReviewCreateDtoFixture;
	updateDto: { content: string };
	mockMediaItem: MediaItemEntityFixture;
}

// ─── Variant ────────────────────────────────────────────────────────────────

export interface VariantCombinationFixture {
	color?: string;
	size?: string;
	[key: string]: string | undefined;
}

export interface VariantEntityFixture extends TimestampedEntity {
	productId: string;
	productType: string;
	combination: VariantCombinationFixture;
	price: number;
	stock: number;
}

export interface VariantFixture {
	entity: VariantEntityFixture;
	createDto: Omit<VariantEntityFixture, 'id' | 'createdAt' | 'updatedAt'>;
	createManyDto: {
		variants: Array<
			Omit<VariantEntityFixture, 'id' | 'createdAt' | 'updatedAt'>
		>;
	};
	syncDto: {
		productId: string;
		productType: string;
		variants: Array<{
			combination: VariantCombinationFixture;
			price: number;
			stock: number;
		}>;
	};
	updateDto: Partial<Pick<VariantEntityFixture, 'price' | 'stock'>>;
	invalidDto: Record<string, unknown>;
}

// ─── Community ──────────────────────────────────────────────────────────────

export interface CommunityEntityFixture extends TimestampedEntity {
	name: string;
	bannerImageId?: string;
}

export interface CommunityFixture {
	entity: CommunityEntityFixture;
	createDto: { name: string; bannerImageId?: string };
	updateDto: { name: string; bannerImageId?: string };
	seal: { id: string; name: string };
	sealUpdated: { id: string; name: string };
}

// ─── MediaItem ──────────────────────────────────────────────────────────────

export interface MediaItemFixture {
	entity: MediaItemEntityFixture;
	createDto: { type: string; name: string; url: string; role: string };
	updateDto: { name: string };
	additionalEntities: Array<{ id: string; name: string }>;
}

// ─── Cart ───────────────────────────────────────────────────────────────────

export interface CartItemEntityFixture extends TimestampedEntity {
	cartShopId: string;
	variantId: string;
	quantity: number;
}

export interface CartEntityFixture extends TimestampedEntity {
	customerId: string;
}

export interface CartFixture {
	cart: CartEntityFixture;
	cartItems: CartItemEntityFixture[];
}

// ─── Customer ───────────────────────────────────────────────────────────────

export interface CustomerFixture {
	customer: {
		id: string;
		accountId: string;
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		createdAt: string;
		updatedAt: string;
	};
	account: {
		id: string;
		email: string;
		role: string;
		isActive: boolean;
		createdAt: string;
		updatedAt: string;
	};
}

// ─── Experience ─────────────────────────────────────────────────────────────

export interface ExperienceEntityFixture extends TimestampedEntity {
	status: string;
	basicInfoId: string;
	mediaInfoId: string;
	detailInfoId: string;
	pricesId: string;
	availabilityId: string;
	itineraryIds: string[];
}

export interface ExperienceCreateDtoFixture {
	status: string;
	basicInfo: Record<string, unknown>;
	mediaInfo: Record<string, unknown>;
	detailInfo: Record<string, unknown>;
	prices: Record<string, unknown>;
	availability: Record<string, unknown>;
	itineraries: unknown[];
}

export interface ExperienceUpdateDtoFixture {
	status?: string;
	basicInfo?: Record<string, unknown>;
	prices?: Record<string, unknown>;
}

export interface ExperienceFixture {
	mockExperience: ExperienceEntityFixture;
	createDto: ExperienceCreateDtoFixture;
	updateDto: ExperienceUpdateDtoFixture;
	mockListItem: Record<string, unknown>;
	mockPaginatedResponse: Record<string, unknown>;
	mockDetailResponse: Record<string, unknown>;
}

// ─── Superfood ──────────────────────────────────────────────────────────────

export interface SuperfoodVariantFixture {
	id: string;
	productId: string;
	productType: string;
	combination: Record<string, string>;
	price: number;
	stock: number;
	SKU?: string;
	isActive?: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface SuperfoodBaseInfoFixture {
	title: string;
	media?: string[];
	description?: string;
	ownerType: string;
	ownerId: string;
}

export interface SuperfoodEntityFixture {
	id: string;
	status: string;
	baseInfo: SuperfoodBaseInfoFixture;
	priceInventary: { basePrice: number; totalStock: number; SKU: string };
	isDiscountActive: boolean;
	categoryId?: string;
	createdAt: string;
	updatedAt: string;
}

export interface SuperfoodFixture {
	superfood: SuperfoodEntityFixture;
	variants: SuperfoodVariantFixture[];
	community: { id: string; name: string; description?: string };
	mediaItems: Array<{
		id: string;
		url: string;
		type: string;
		position: number;
	}>;
}

export interface SuperfoodProductBaseInfoFixture {
	title: string;
	mediaIds: string[];
	description: string;
	general_features?: string[];
	nutritional_features?: unknown[];
	benefits?: unknown[];
	ownerType: string;
	ownerId: string;
}

export interface SuperfoodProductPriceInventoryFixture {
	basePrice: number;
	totalStock: number;
	SKU: string;
}

export interface SuperfoodProductEntityFixture extends TimestampedEntity {
	status: string;
	baseInfo: SuperfoodProductBaseInfoFixture;
	priceInventory: SuperfoodProductPriceInventoryFixture;
	color?: string;
	detailSourceProductId?: string;
	categoryId?: string;
}

export interface SuperfoodProductUpdateDtoFixture {
	status?: string;
	baseInfo?: SuperfoodProductBaseInfoFixture;
	priceInventory?: SuperfoodProductPriceInventoryFixture;
	color?: string;
	detailSourceProduct?: Record<string, unknown>;
	categoryId?: string;
}

export interface SuperfoodProductFixture {
	entity: SuperfoodProductEntityFixture;
	createDto: Record<string, unknown>;
	updateDto: SuperfoodProductUpdateDtoFixture;
	listItem: Record<string, unknown>;
	paginatedResponse: Record<string, unknown>;
	detailResponse: Record<string, unknown>;
}

// ─── Textile Product ────────────────────────────────────────────────────────

export interface TextileProductEntityFixture extends TimestampedEntity {
	status: string;
	baseInfo: {
		title: string;
		mediaIds: string[];
		description: string;
		ownerType: string;
		ownerId: string;
	};
	priceInventary: {
		basePrice: number;
		totalStock: number;
		SKU: string;
	};
	isDiscountActive: boolean;
	categoryId: string;
	options?: Array<{
		name: string;
		values: Array<{ label: string; mediaIds: string[] }>;
	}>;
}

export interface TextileVariantFixture {
	id: string;
	productId: string;
	productType: string;
	combination: Record<string, string>;
	price: number;
	stock: number;
	SKU?: string;
	isActive?: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface TextileMediaItemFixture {
	id: string;
	url: string;
	type: string;
	position: number;
}

export interface TextileShopFixture {
	id: string;
	name: string;
	description: string;
	sellerId: string;
}

export interface TextileProductFixture {
	entity: TextileProductEntityFixture;
	createDto: Omit<
		TextileProductEntityFixture,
		'id' | 'createdAt' | 'updatedAt' | 'isDiscountActive' | 'options'
	>;
	updateDto: Record<string, unknown>;
	listItem: Record<string, unknown>;
	paginatedResponse: Record<string, unknown>;
	detailResponse: Record<string, unknown>;
	variants: TextileVariantFixture[];
	shop: TextileShopFixture;
	mediaItems: TextileMediaItemFixture[];
}

// ─── Origin Product Community ────────────────────────────────────────────────

export interface OriginProductCommunityEntityFixture extends TimestampedEntity {
	name: string;
	regionId: string;
}

export interface OriginProductCommunityFixture {
	entity: OriginProductCommunityEntityFixture;
	createDto: { name: string; regionId: string };
	updateDto: { name: string };
}

// ─── Origin Product Region ───────────────────────────────────────────────────

export interface OriginProductRegionEntityFixture extends TimestampedEntity {
	name: string;
}

export interface OriginProductRegionFixture {
	entity: OriginProductRegionEntityFixture;
	createDto: { name: string };
	updateDto: { name: string };
}

// ─── Superfood Sub-Resource (shared shape) ───────────────────────────────────

export interface SuperfoodSubResourceEntityFixture extends TimestampedEntity {
	name: string;
	description?: string;
	color?: string;
	iconId?: string;
	icon?: string;
	status?: string;
}

export interface SuperfoodSubResourceFixture {
	entity: SuperfoodSubResourceEntityFixture;
	createDto: Record<string, unknown>;
	optionalFieldName?: string;
	additionalEntities: SuperfoodSubResourceEntityFixture[];
}
