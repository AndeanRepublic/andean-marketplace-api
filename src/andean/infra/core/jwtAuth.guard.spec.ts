import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwtAuth.guard';
import { IS_PUBLIC_KEY } from './public.decorator';
import { IS_OPTIONAL_AUTH_KEY } from './optionalAuth.decorator';

describe('JwtAuthGuard', () => {
	let guard: JwtAuthGuard;
	let jwtService: jest.Mocked<JwtService>;
	let reflector: jest.Mocked<Reflector>;

	beforeEach(() => {
		jwtService = {
			verifyAsync: jest.fn(),
		} as any;

		reflector = {
			getAllAndOverride: jest.fn(),
		} as any;

		guard = new JwtAuthGuard(jwtService, reflector);
	});

	const createMockContext = (
		authHeader?: string,
	): ExecutionContext & { switchToHttp: () => any } => {
		const request = {
			headers: authHeader ? { authorization: authHeader } : {},
		};

		return {
			switchToHttp: () => ({
				getRequest: () => request,
			}),
			getHandler: jest.fn(),
			getClass: jest.fn(),
		} as any;
	};

	describe('OptionalAuth routes', () => {
		beforeEach(() => {
			// Mock route is marked with @OptionalAuth()
			reflector.getAllAndOverride
				.mockReturnValueOnce(false) // IS_PUBLIC_KEY = false
				.mockReturnValueOnce(true); // IS_OPTIONAL_AUTH_KEY = true
		});

		it('should pass without token (task 4.1)', async () => {
			const context = createMockContext();

			const result = await guard.canActivate(context);

			expect(result).toBe(true);
			expect(jwtService.verifyAsync).not.toHaveBeenCalled();
		});

		it('should populate request.user with valid token (task 4.2)', async () => {
			const context = createMockContext('Bearer valid-token');
			const mockPayload = { sub: 'user-123', roles: ['CUSTOMER'] };
			jwtService.verifyAsync.mockResolvedValue(mockPayload);

			const result = await guard.canActivate(context);
			const request = context.switchToHttp().getRequest();

			expect(result).toBe(true);
			expect(request.user).toEqual({
				userId: 'user-123',
				roles: ['CUSTOMER'],
			});
		});

		it('should pass without throwing when token is invalid/expired (task 4.3)', async () => {
			const context = createMockContext('Bearer invalid-token');
			jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

			const result = await guard.canActivate(context);

			expect(result).toBe(true);
			const request = context.switchToHttp().getRequest();
			expect(request.user).toBeUndefined();
		});
	});

	describe('Protected routes (not OptionalAuth)', () => {
		beforeEach(() => {
			// Mock route is NOT marked with @OptionalAuth()
			reflector.getAllAndOverride
				.mockReturnValueOnce(false) // IS_PUBLIC_KEY = false
				.mockReturnValueOnce(false); // IS_OPTIONAL_AUTH_KEY = false
		});

		it('should throw UnauthorizedException when token is missing', async () => {
			const context = createMockContext();

			await expect(guard.canActivate(context)).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it('should throw UnauthorizedException when token is invalid', async () => {
			const context = createMockContext('Bearer invalid-token');
			jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

			await expect(guard.canActivate(context)).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});
});
