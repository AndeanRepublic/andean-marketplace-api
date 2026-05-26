import { UserOrderFilterStrategy } from './UserOrderFilterStrategy';

describe('UserOrderFilterStrategy', () => {
	let strategy: UserOrderFilterStrategy;

	beforeEach(() => {
		strategy = new UserOrderFilterStrategy();
	});

	describe('buildFilter', () => {
		it('should return filter with customerId matching user.userId', async () => {
			const user = { userId: 'user-123', roles: ['USER'] };
			
			const filter = await strategy.buildFilter(user);
			
			expect(filter).toEqual({ customerId: 'user-123' });
		});

		it('should handle different userId values', async () => {
			const user = { userId: 'different-user-id-456', roles: ['USER'] };
			
			const filter = await strategy.buildFilter(user);
			
			expect(filter).toEqual({ customerId: 'different-user-id-456' });
		});
	});
});
