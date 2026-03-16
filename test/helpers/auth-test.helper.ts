import { CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Mock JWT auth user profiles for e2e tests.
 * Use these when testing endpoints that require authentication.
 */
export const mockAuthUsers = {
	admin: {
		sub: 'admin-uuid-001',
		email: 'admin@andean-marketplace.com',
		role: 'admin',
	},
	seller: {
		sub: 'seller-uuid-001',
		email: 'seller@andean-marketplace.com',
		role: 'seller',
	},
	customer: {
		sub: 'customer-uuid-789',
		email: 'juan.perez@example.com',
		role: 'customer',
	},
};

/**
 * Configurable mock guard for e2e tests.
 *
 * Usage in TestingModule:
 * ```ts
 * const moduleFixture = await Test.createTestingModule({ ... })
 *   .overrideGuard(JwtAuthGuard)
 *   .useValue(new MockAuthGuard(mockAuthUsers.admin))
 *   .compile();
 * ```
 *
 * To test unauthorized access:
 * ```ts
 * .overrideGuard(JwtAuthGuard)
 * .useValue(new MockAuthGuard(null)) // will reject
 * ```
 */
export class MockAuthGuard implements CanActivate {
	constructor(private readonly user: Record<string, any> | null) { }

	canActivate(context: ExecutionContext): boolean {
		if (!this.user) {
			return false;
		}
		const req = context.switchToHttp().getRequest();
		req.user = this.user;
		return true;
	}
}

/**
 * Factory to create a mock guard that always allows access
 * and injects the given user into `request.user`.
 */
export function createAllowAllGuard(user = mockAuthUsers.admin): MockAuthGuard {
	return new MockAuthGuard(user);
}

/**
 * Factory to create a mock guard that always rejects access.
 * Useful for testing 401/403 behaviour.
 */
export function createDenyAllGuard(): MockAuthGuard {
	return new MockAuthGuard(null);
}
