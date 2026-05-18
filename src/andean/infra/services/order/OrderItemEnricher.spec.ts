import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemEnricher } from './OrderItemEnricher';
import { ProductInfoProviderRegistry } from '../products/ProductInfoProviderRegistry';
import { OwnerNameResolver } from '../OwnerNameResolver';
import { Order, OrderItem } from '../../../domain/entities/order/Order';
import { ProductType } from '../../../domain/enums/ProductType';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { ProductInfo } from '../../../app/models/shared/ProductInfo';

describe('OrderItemEnricher', () => {
	let enricher: OrderItemEnricher;
	let productInfoProviderRegistry: jest.Mocked<ProductInfoProviderRegistry>;
	let ownerNameResolver: jest.Mocked<OwnerNameResolver>;

	beforeEach(async () => {
		const mockProductInfoProviderRegistry = {
			getProductInfoBatch: jest.fn(),
		};

		const mockOwnerNameResolver = {
			resolve: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OrderItemEnricher,
				{
					provide: ProductInfoProviderRegistry,
					useValue: mockProductInfoProviderRegistry,
				},
				{
					provide: OwnerNameResolver,
					useValue: mockOwnerNameResolver,
				},
			],
		}).compile();

		enricher = module.get<OrderItemEnricher>(OrderItemEnricher);
		productInfoProviderRegistry = module.get(ProductInfoProviderRegistry);
		ownerNameResolver = module.get(OwnerNameResolver);
	});

	it('should be defined', () => {
		expect(enricher).toBeDefined();
	});

	describe('enrichOrders', () => {
		it('should return empty array for empty input', async () => {
			const result = await enricher.enrichOrders([]);
			expect(result).toEqual([]);
		});

		it('should enrich textile items with imageUrl and ownerName', async () => {
			const order = createMockOrder([
				createMockOrderItem('product-1', ProductType.TEXTILE, 'Poncho Andino'),
			]);

			const productInfoMap = new Map<string, ProductInfo>([
				[
					'product-1',
					{
						title: 'Poncho Andino',
						thumbnailImgUrl: 'https://storage.example.com/media-1.jpg',
						ownerType: 'SHOP',
						ownerId: 'seller-123',
						isDiscountActive: false,
					},
				],
			]);
			productInfoProviderRegistry.getProductInfoBatch.mockResolvedValue(
				productInfoMap,
			);
			ownerNameResolver.resolve.mockResolvedValue('Tienda Artesanías');

			const result = await enricher.enrichOrders([order]);

			expect(productInfoProviderRegistry.getProductInfoBatch).toHaveBeenCalledWith(
				new Map([[ProductType.TEXTILE, ['product-1']]]),
			);
			expect(ownerNameResolver.resolve).toHaveBeenCalledWith('SHOP', 'seller-123');
			expect(result[0].items[0].imageUrl).toBe(
				'https://storage.example.com/media-1.jpg',
			);
			expect(result[0].items[0].ownerName).toBe('Tienda Artesanías');
		});

		it('should batch duplicate productIds into single query', async () => {
			const order = createMockOrder([
				createMockOrderItem('product-1', ProductType.TEXTILE, 'Poncho 1'),
				createMockOrderItem('product-1', ProductType.TEXTILE, 'Poncho 2'),
				createMockOrderItem('product-2', ProductType.TEXTILE, 'Sweater'),
			]);

			const productInfoMap = new Map<string, ProductInfo>([
				[
					'product-1',
					{
						title: 'Poncho 1',
						thumbnailImgUrl: 'https://storage.example.com/media-1.jpg',
						ownerType: 'SHOP',
						ownerId: 'seller-123',
						isDiscountActive: false,
					},
				],
				[
					'product-2',
					{
						title: 'Sweater',
						thumbnailImgUrl: 'https://storage.example.com/media-2.jpg',
						ownerType: 'SHOP',
						ownerId: 'seller-456',
						isDiscountActive: true,
					},
				],
			]);
			productInfoProviderRegistry.getProductInfoBatch.mockResolvedValue(
				productInfoMap,
			);
			ownerNameResolver.resolve
				.mockResolvedValueOnce('Tienda 1')
				.mockResolvedValueOnce('Tienda 2');

			await enricher.enrichOrders([order]);

			// Should only call registry once with unique IDs
			expect(productInfoProviderRegistry.getProductInfoBatch).toHaveBeenCalledTimes(
				1,
			);
			expect(productInfoProviderRegistry.getProductInfoBatch).toHaveBeenCalledWith(
				new Map([[ProductType.TEXTILE, ['product-1', 'product-2']]]),
			);
			// Should resolve both unique owners
			expect(ownerNameResolver.resolve).toHaveBeenCalledTimes(2);
			expect(ownerNameResolver.resolve).toHaveBeenCalledWith('SHOP', 'seller-123');
			expect(ownerNameResolver.resolve).toHaveBeenCalledWith('SHOP', 'seller-456');
		});

		it('should not enrich deleted product (missing from ProductInfo map)', async () => {
			const order = createMockOrder([
				createMockOrderItem('deleted-product', ProductType.TEXTILE, 'Old Item'),
			]);

			// Product not found - registry returns empty map
			const productInfoMap = new Map<string, ProductInfo>();
			productInfoProviderRegistry.getProductInfoBatch.mockResolvedValue(
				productInfoMap,
			);

			const result = await enricher.enrichOrders([order]);

			expect(result[0].items[0].imageUrl).toBeUndefined();
			expect(result[0].items[0].ownerName).toBeUndefined();
			// Should NOT call ownerNameResolver for missing products
			expect(ownerNameResolver.resolve).not.toHaveBeenCalled();
		});

		it('should support multiple product types (TEXTILE, SUPERFOOD, BOX)', async () => {
			const order = createMockOrder([
				createMockOrderItem('superfood-1', ProductType.SUPERFOOD, 'Quinoa'),
				createMockOrderItem('box-1', ProductType.BOX, 'Starter Box'),
				createMockOrderItem('textile-1', ProductType.TEXTILE, 'Poncho'),
			]);

			const productInfoMap = new Map<string, ProductInfo>([
				[
					'superfood-1',
					{
						title: 'Quinoa',
						thumbnailImgUrl: 'https://storage.example.com/superfood-1.jpg',
						ownerType: 'COMMUNITY',
						ownerId: 'community-1',
						isDiscountActive: false,
					},
				],
				[
					'box-1',
					{
						title: 'Starter Box',
						thumbnailImgUrl: 'https://storage.example.com/box-1.jpg',
						ownerType: 'SHOP',
						ownerId: 'seller-2',
						isDiscountActive: true,
					},
				],
				[
					'textile-1',
					{
						title: 'Poncho',
						thumbnailImgUrl: 'https://storage.example.com/textile-1.jpg',
						ownerType: 'SHOP',
						ownerId: 'seller-3',
						isDiscountActive: false,
					},
				],
			]);
			productInfoProviderRegistry.getProductInfoBatch.mockResolvedValue(
				productInfoMap,
			);
			ownerNameResolver.resolve
				.mockResolvedValueOnce('Comunidad Andina')
				.mockResolvedValueOnce('Tienda Box')
				.mockResolvedValueOnce('Tienda Textiles');

			const result = await enricher.enrichOrders([order]);

			// Should group by type and call registry once
			expect(productInfoProviderRegistry.getProductInfoBatch).toHaveBeenCalledWith(
				new Map([
					[ProductType.SUPERFOOD, ['superfood-1']],
					[ProductType.BOX, ['box-1']],
					[ProductType.TEXTILE, ['textile-1']],
				]),
			);

			// All items should have imageUrl and ownerName
			expect(result[0].items[0].imageUrl).toBe(
				'https://storage.example.com/superfood-1.jpg',
			);
			expect(result[0].items[0].ownerName).toBe('Comunidad Andina');
			expect(result[0].items[1].imageUrl).toBe(
				'https://storage.example.com/box-1.jpg',
			);
			expect(result[0].items[1].ownerName).toBe('Tienda Box');
			expect(result[0].items[2].imageUrl).toBe(
				'https://storage.example.com/textile-1.jpg',
			);
			expect(result[0].items[2].ownerName).toBe('Tienda Textiles');
		});

		it('should handle multiple orders with shared products', async () => {
			const order1 = createMockOrder([
				createMockOrderItem('product-1', ProductType.TEXTILE, 'Poncho'),
			]);
			const order2 = createMockOrder([
				createMockOrderItem('product-1', ProductType.TEXTILE, 'Poncho'),
			]);

			const productInfoMap = new Map<string, ProductInfo>([
				[
					'product-1',
					{
						title: 'Poncho',
						thumbnailImgUrl: 'https://storage.example.com/media-1.jpg',
						ownerType: 'SHOP',
						ownerId: 'seller-123',
						isDiscountActive: false,
					},
				],
			]);
			productInfoProviderRegistry.getProductInfoBatch.mockResolvedValue(
				productInfoMap,
			);
			ownerNameResolver.resolve.mockResolvedValue('Tienda Compartida');

			const result = await enricher.enrichOrders([order1, order2]);

			// Should only query once for the shared product
			expect(productInfoProviderRegistry.getProductInfoBatch).toHaveBeenCalledTimes(
				1,
			);
			expect(productInfoProviderRegistry.getProductInfoBatch).toHaveBeenCalledWith(
				new Map([[ProductType.TEXTILE, ['product-1']]]),
			);
			// Should only resolve the shared owner once
			expect(ownerNameResolver.resolve).toHaveBeenCalledTimes(1);
			expect(ownerNameResolver.resolve).toHaveBeenCalledWith('SHOP', 'seller-123');

			// Both orders should have enriched items
			expect(result[0].items[0].imageUrl).toBe(
				'https://storage.example.com/media-1.jpg',
			);
			expect(result[0].items[0].ownerName).toBe('Tienda Compartida');
			expect(result[1].items[0].imageUrl).toBe(
				'https://storage.example.com/media-1.jpg',
			);
			expect(result[1].items[0].ownerName).toBe('Tienda Compartida');
		});

		it('should handle product with no thumbnail image', async () => {
			const order = createMockOrder([
				createMockOrderItem('product-1', ProductType.TEXTILE, 'Poncho'),
			]);

			// Product exists but has no thumbnail
			const productInfoMap = new Map<string, ProductInfo>([
				[
					'product-1',
					{
						title: 'Poncho',
						thumbnailImgUrl: '', // Empty string
						ownerType: 'SHOP',
						ownerId: 'seller-123',
						isDiscountActive: false,
					},
				],
			]);
			productInfoProviderRegistry.getProductInfoBatch.mockResolvedValue(
				productInfoMap,
			);
			ownerNameResolver.resolve.mockResolvedValue('Tienda Sin Imagen');

			const result = await enricher.enrichOrders([order]);

			expect(result[0].items[0].imageUrl).toBeUndefined();
			expect(result[0].items[0].ownerName).toBe('Tienda Sin Imagen');
		});

		it('should handle unsupported product types gracefully', async () => {
			const order = createMockOrder([
				createMockOrderItem('experience-1', ProductType.EXPERIENCE, 'Tour'),
			]);

			// Registry returns empty map for unsupported types
			const productInfoMap = new Map<string, ProductInfo>();
			productInfoProviderRegistry.getProductInfoBatch.mockResolvedValue(
				productInfoMap,
			);

			const result = await enricher.enrichOrders([order]);

			expect(result[0].items[0].imageUrl).toBeUndefined();
			expect(result[0].items[0].ownerName).toBeUndefined();
		});

		it('should deduplicate owner resolution for same owner across different products', async () => {
			const order = createMockOrder([
				createMockOrderItem('product-1', ProductType.TEXTILE, 'Poncho'),
				createMockOrderItem('product-2', ProductType.TEXTILE, 'Scarf'),
			]);

			// Both products from same seller
			const productInfoMap = new Map<string, ProductInfo>([
				[
					'product-1',
					{
						title: 'Poncho',
						thumbnailImgUrl: 'https://storage.example.com/media-1.jpg',
						ownerType: 'SHOP',
						ownerId: 'seller-123',
						isDiscountActive: false,
					},
				],
				[
					'product-2',
					{
						title: 'Scarf',
						thumbnailImgUrl: 'https://storage.example.com/media-2.jpg',
						ownerType: 'SHOP',
						ownerId: 'seller-123', // Same seller
						isDiscountActive: false,
					},
				],
			]);
			productInfoProviderRegistry.getProductInfoBatch.mockResolvedValue(
				productInfoMap,
			);
			ownerNameResolver.resolve.mockResolvedValue('Tienda Única');

			const result = await enricher.enrichOrders([order]);

			// Should only resolve the owner once (deduplication)
			expect(ownerNameResolver.resolve).toHaveBeenCalledTimes(1);
			expect(ownerNameResolver.resolve).toHaveBeenCalledWith('SHOP', 'seller-123');

			// Both items should have the same ownerName
			expect(result[0].items[0].ownerName).toBe('Tienda Única');
			expect(result[0].items[1].ownerName).toBe('Tienda Única');
		});

		it('should handle products without owner info', async () => {
			const order = createMockOrder([
				createMockOrderItem('product-1', ProductType.TEXTILE, 'Poncho'),
			]);

			// Product has no owner info
			const productInfoMap = new Map<string, ProductInfo>([
				[
					'product-1',
					{
						title: 'Poncho',
						thumbnailImgUrl: 'https://storage.example.com/media-1.jpg',
						ownerType: '',
						ownerId: '',
						isDiscountActive: false,
					},
				],
			]);
			productInfoProviderRegistry.getProductInfoBatch.mockResolvedValue(
				productInfoMap,
			);

			const result = await enricher.enrichOrders([order]);

			// Should not attempt to resolve owner
			expect(ownerNameResolver.resolve).not.toHaveBeenCalled();
			expect(result[0].items[0].imageUrl).toBe(
				'https://storage.example.com/media-1.jpg',
			);
			expect(result[0].items[0].ownerName).toBeUndefined();
		});
	});
});

// Helper functions
function createMockOrder(items: OrderItem[]): Order {
	return new Order(
		'order-123',
		'customer-123',
		'customer@example.com',
		OrderStatus.PROCESSING,
		items,
		{
			subtotal: 100,
			discount: 0,
			deliveryCost: 10,
			taxOrFee: 5,
			totalAmount: 115,
			currency: 'USD',
		},
		{
			recipientName: 'John Doe',
			phone: '+1234567890',
			countryCode: 'US',
			country: 'United States',
			administrativeArea: {},
			addressLine1: '123 Main St',
		},
		{
			method: PaymentMethod.PAYPAL,
		},
		DeliveryOption.DHL,
		new Date(),
		new Date(),
	);
}

function createMockOrderItem(
	productId: string,
	productType: ProductType,
	name: string,
): OrderItem {
	return {
		productId,
		productType,
		name,
		quantity: 1,
		unitPrice: 50,
		discount: 0,
		totalPrice: 50,
	};
}
