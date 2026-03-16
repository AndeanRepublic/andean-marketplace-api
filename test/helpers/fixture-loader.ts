import * as fs from 'fs';
import * as path from 'path';

/**
 * Helper class to load JSON fixtures for e2e tests.
 * Fixtures are stored in test/fixtures/ directory.
 *
 * All mock data lives in JSON so it's easy to add, change,
 * or duplicate data without touching TypeScript test code.
 */
export class FixtureLoader {
	private static fixturesPath = path.join(__dirname, '../fixtures');
	private static cache = new Map<string, any>();

	/**
	 * Load a JSON fixture file (cached after first read).
	 * @param filename - e.g. 'textile-product.fixture.json'
	 */
	static load<T = any>(filename: string): T {
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
	static loadTextileProduct() {
		return this.load('textile-product.fixture.json');
	}

	static loadSuperfood() {
		return this.load('superfood.fixture.json');
	}

	static loadCustomer() {
		return this.load('customer.fixture.json');
	}

	static loadCart() {
		return this.load('cart.fixture.json');
	}

	// ─── Domain fixtures ────────────────────────────────────────────
	static loadCommunity() {
		return this.load('community.fixture.json');
	}

	static loadMediaItem() {
		return this.load('media-item.fixture.json');
	}

	static loadOriginProductCommunity() {
		return this.load('origin-product-community.fixture.json');
	}

	static loadOriginProductRegion() {
		return this.load('origin-product-region.fixture.json');
	}

	static loadSuperfoodProduct() {
		return this.load('superfood-product.fixture.json');
	}

	static loadVariant() {
		return this.load('variant.fixture.json');
	}

	// ─── Superfood sub-resource fixtures ────────────────────────────
	static loadSuperfoodBenefit() {
		return this.load('superfood-benefit.fixture.json');
	}

	static loadSuperfoodCategory() {
		return this.load('superfood-category.fixture.json');
	}

	static loadSuperfoodCertification() {
		return this.load('superfood-certification.fixture.json');
	}

	static loadSuperfoodNutritionalFeature() {
		return this.load('superfood-nutritional-feature.fixture.json');
	}

	static loadSuperfoodPreservationMethod() {
		return this.load('superfood-preservation-method.fixture.json');
	}

	static loadSuperfoodProductPresentation() {
		return this.load('superfood-product-presentation.fixture.json');
	}

	static loadSuperfoodSalesUnitSize() {
		return this.load('superfood-sales-unit-size.fixture.json');
	}

	static loadSuperfoodType() {
		return this.load('superfood-type.fixture.json');
	}

	// ─── Box & BoxSeal fixtures ─────────────────────────────────────
	static loadBox() {
		return this.load('box.fixture.json');
	}

	static loadBoxSeal() {
		return this.load('box-seal.fixture.json');
	}

	static loadReview() {
		return this.load('review.fixture.json');
	}

	// ─── Order fixtures ─────────────────────────────────────────────
	static loadOrder() {
		return this.load('order.fixture.json');
	}

	// ─── Experience fixtures ────────────────────────────────────────
	static loadExperience() {
		return this.load('experience.fixture.json');
	}
}
