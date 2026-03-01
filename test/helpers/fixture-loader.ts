import * as fs from 'fs';
import * as path from 'path';
import type {
	BoxFixture,
	BoxSealFixture,
	CartFixture,
	CommunityFixture,
	CustomerFixture,
	ExperienceFixture,
	MediaItemFixture,
	OrderFixture,
	OriginProductCommunityFixture,
	OriginProductRegionFixture,
	ReviewFixture,
	SuperfoodFixture,
	SuperfoodProductFixture,
	SuperfoodSubResourceFixture,
	TextileProductFixture,
	VariantFixture,
} from './fixture-types';

/**
 * Helper class to load JSON fixtures for e2e tests.
 * Fixtures are stored in test/fixtures/ directory.
 *
 * All mock data lives in JSON so it's easy to add, change,
 * or duplicate data without touching TypeScript test code.
 */
export class FixtureLoader {
	private static fixturesPath = path.join(__dirname, '../fixtures');
	private static cache = new Map<string, unknown>();

	/**
	 * Load a JSON fixture file (cached after first read).
	 * @param filename - e.g. 'textile-product.fixture.json'
	 */
	static load<T>(filename: string): T {
		if (this.cache.has(filename)) {
			return this.cache.get(filename) as T;
		}
		const filePath = path.join(this.fixturesPath, filename);
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		const parsed = JSON.parse(fileContent) as T;
		this.cache.set(filename, parsed);
		return parsed;
	}

	/** Clear the fixture cache (useful in test teardown) */
	static clearCache(): void {
		this.cache.clear();
	}

	// ─── Cart & Customer (used by cartShop tests) ───────────────────
	static loadTextileProduct(): TextileProductFixture {
		return this.load<TextileProductFixture>('textile-product.fixture.json');
	}

	static loadSuperfood(): SuperfoodFixture {
		return this.load<SuperfoodFixture>('superfood.fixture.json');
	}

	static loadCustomer(): CustomerFixture {
		return this.load<CustomerFixture>('customer.fixture.json');
	}

	static loadCart(): CartFixture {
		return this.load<CartFixture>('cart.fixture.json');
	}

	// ─── Domain fixtures ────────────────────────────────────────────
	static loadCommunity(): CommunityFixture {
		return this.load<CommunityFixture>('community.fixture.json');
	}

	static loadMediaItem(): MediaItemFixture {
		return this.load<MediaItemFixture>('media-item.fixture.json');
	}

	static loadOriginProductCommunity(): OriginProductCommunityFixture {
		return this.load<OriginProductCommunityFixture>(
			'origin-product-community.fixture.json',
		);
	}

	static loadOriginProductRegion(): OriginProductRegionFixture {
		return this.load<OriginProductRegionFixture>(
			'origin-product-region.fixture.json',
		);
	}

	static loadSuperfoodProduct(): SuperfoodProductFixture {
		return this.load<SuperfoodProductFixture>('superfood-product.fixture.json');
	}

	static loadVariant(): VariantFixture {
		return this.load<VariantFixture>('variant.fixture.json');
	}

	// ─── Superfood sub-resource fixtures ────────────────────────────
	static loadSuperfoodBenefit(): SuperfoodSubResourceFixture {
		return this.load<SuperfoodSubResourceFixture>(
			'superfood-benefit.fixture.json',
		);
	}

	static loadSuperfoodCategory(): SuperfoodSubResourceFixture {
		return this.load<SuperfoodSubResourceFixture>(
			'superfood-category.fixture.json',
		);
	}

	static loadSuperfoodCertification(): SuperfoodSubResourceFixture {
		return this.load<SuperfoodSubResourceFixture>(
			'superfood-certification.fixture.json',
		);
	}

	static loadSuperfoodNutritionalFeature(): SuperfoodSubResourceFixture {
		return this.load<SuperfoodSubResourceFixture>(
			'superfood-nutritional-feature.fixture.json',
		);
	}

	static loadSuperfoodPreservationMethod(): SuperfoodSubResourceFixture {
		return this.load<SuperfoodSubResourceFixture>(
			'superfood-preservation-method.fixture.json',
		);
	}

	static loadSuperfoodProductPresentation(): SuperfoodSubResourceFixture {
		return this.load<SuperfoodSubResourceFixture>(
			'superfood-product-presentation.fixture.json',
		);
	}

	static loadSuperfoodSalesUnitSize(): SuperfoodSubResourceFixture {
		return this.load<SuperfoodSubResourceFixture>(
			'superfood-sales-unit-size.fixture.json',
		);
	}

	static loadSuperfoodType(): SuperfoodSubResourceFixture {
		return this.load<SuperfoodSubResourceFixture>(
			'superfood-type.fixture.json',
		);
	}

	// ─── Box & BoxSeal fixtures ─────────────────────────────────────
	static loadBox(): BoxFixture {
		return this.load<BoxFixture>('box.fixture.json');
	}

	static loadBoxSeal(): BoxSealFixture {
		return this.load<BoxSealFixture>('box-seal.fixture.json');
	}

	static loadReview(): ReviewFixture {
		return this.load<ReviewFixture>('review.fixture.json');
	}

	// ─── Order fixtures ─────────────────────────────────────────────
	static loadOrder(): OrderFixture {
		return this.load<OrderFixture>('order.fixture.json');
	}

	// ─── Experience fixtures ────────────────────────────────────────
	static loadExperience(): ExperienceFixture {
		return this.load<ExperienceFixture>('experience.fixture.json');
	}
}
