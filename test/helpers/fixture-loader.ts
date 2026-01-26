import * as fs from 'fs';
import * as path from 'path';

/**
 * Helper class to load JSON fixtures for e2e tests
 * Fixtures are stored in test/fixtures/ directory
 */
export class FixtureLoader {
	private static fixturesPath = path.join(__dirname, '../fixtures');

	/**
	 * Load a JSON fixture file
	 * @param filename - Name of the fixture file (e.g., 'textile-product.fixture.json')
	 * @returns Parsed JSON object
	 */
	static load<T = any>(filename: string): T {
		const filePath = path.join(this.fixturesPath, filename);
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		return JSON.parse(fileContent) as T;
	}

	/**
	 * Load textile product fixtures
	 */
	static loadTextileProduct() {
		return this.load('textile-product.fixture.json');
	}

	/**
	 * Load superfood fixtures
	 */
	static loadSuperfood() {
		return this.load('superfood.fixture.json');
	}

	/**
	 * Load customer fixtures
	 */
	static loadCustomer() {
		return this.load('customer.fixture.json');
	}

	/**
	 * Load cart fixtures
	 */
	static loadCart() {
		return this.load('cart.fixture.json');
	}
}
