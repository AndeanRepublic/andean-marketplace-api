import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Request } from 'express';
import { Payload } from '../../domain/interfaces/Payload';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) { }

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}

		const request: Request = context.switchToHttp().getRequest();
		const user: Payload = <Payload>request.user;

		if (!user || !user.roles || user.roles.length === 0) {
			return false;
		}

		return requiredRoles.some(role => user.roles.includes(role as any));
	}
}
