import { OrderSchema } from './order.schema';

describe('OrderSchema', () => {
	describe('customerId index', () => {
		it('should have an index on customerId field', () => {
			const indexes = OrderSchema.indexes();
			
			// Check if there's an index defined for customerId
			const customerIdIndex = indexes.find((index) => {
				const fields = index[0];
				return fields.customerId === 1;
			});
			
			expect(customerIdIndex).toBeDefined();
		});
	});
});
