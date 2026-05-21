import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { IS_OPTIONAL_AUTH_KEY } from './optionalAuth.decorator';
import { AccountRepository } from '../../app/datastore/Account.repo';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
		@Inject(AccountRepository)
		private accountRepository: AccountRepository,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Check if the route is marked as public
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			// 💡 Allow access to public routes
			return true;
		}

		// Check if the route is marked as optional auth
		const isOptionalAuth = this.reflector.getAllAndOverride<boolean>(
			IS_OPTIONAL_AUTH_KEY,
			[context.getHandler(), context.getClass()],
		);

		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			if (isOptionalAuth) {
				// 💡 Allow access to optional auth routes without token
				return true;
			}
			throw new UnauthorizedException('Token not found');
		}

		try {
			// 💡 Here the JWT secret key that's used for verifying the payload
			// is the key that was passed in the JwtModule
			const payload: JwtPayload = await this.jwtService.verifyAsync(token);

			// Validate passwordVersion to invalidate old tokens after password change
			const account = await this.accountRepository.getAccountById(payload.sub);
			if (!account) {
				throw new UnauthorizedException('Account not found');
			}

			const tokenPasswordVersion = payload.passwordVersion ?? 1;
			if (account.passwordVersion !== tokenPasswordVersion) {
				throw new UnauthorizedException('Session invalidated');
			}

			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			request['user'] = {
				userId: payload.sub,
				roles: payload.roles,
				passwordVersion: account.passwordVersion,
			};
		} catch (error) {
			if (isOptionalAuth) {
				// 💡 Allow access to optional auth routes with invalid token
				return true;
			}
			// Re-throw if it's already an UnauthorizedException with specific message
			if (error instanceof UnauthorizedException) {
				throw error;
			}
			throw new UnauthorizedException('Invalid token');
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
