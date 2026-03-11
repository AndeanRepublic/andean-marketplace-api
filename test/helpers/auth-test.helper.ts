import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AccountRole } from '../../src/andean/domain/enums/AccountRole';

/**
 * Mock JWT auth user profiles for e2e tests.
 *
 * IMPORTANT: `roles` must be an array of `AccountRole` values — this matches
 * what `JwtAuthGuard` sets on `request.user` after verifying a real JWT:
 *   `request['user'] = { userId: payload.sub, roles: payload.roles }`
 *
 * And what `RolesGuard` reads:
 *   `user.roles.includes(role)`
 */
export const mockAuthUsers = {
	admin: {
		userId: 'admin-uuid-001',
		email: 'admin@andean-marketplace.com',
		roles: [AccountRole.ADMIN],
	},
	seller: {
		userId: 'seller-uuid-001',
		email: 'seller@andean-marketplace.com',
		roles: [AccountRole.SELLER],
	},
	customer: {
		userId: 'customer-uuid-789',
		email: 'juan.perez@example.com',
		roles: [AccountRole.USER],
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
 * .useValue(new MockAuthGuard(null)) // will reject with false
 * ```
 */
export class MockAuthGuard implements CanActivate {
	constructor(private readonly user: Record<string, any> | null) {}

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
 *
 * The user shape must match what JwtAuthGuard sets:
 *   `{ userId: string, roles: AccountRole[] }`
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
