import { BookingSchema } from './booking.schema';

describe('BookingSchema', () => {
	describe('customerInfo.customerId index', () => {
		it('should have an index on customerInfo.customerId field', () => {
			const indexes = BookingSchema.indexes();
			
			// Check if there's an index defined for customerInfo.customerId
			const customerIdIndex = indexes.find((index) => {
				const fields = index[0];
				return fields['customerInfo.customerId'] === 1;
			});
			
			expect(customerIdIndex).toBeDefined();
		});
	});
});
