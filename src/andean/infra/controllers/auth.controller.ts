import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/LoginDto';
import { AssignAdminDto } from './dto/AssignAdminDto';
import { SessionToken } from '../../app/models/users/SessionToken';
import { LoginUseCase } from '../../app/use_cases/auth/LoginUseCase';
import { AssignAdminUseCase } from '../../app/use_cases/auth/AssignAdminUseCase';
import { Public } from '../core/public.decorator';
import { JwtAuthGuard } from '../core/jwtAuth.guard';
import { RolesGuard } from '../core/roles.guard';
import { Roles } from '../core/roles.decorator';
import { AccountRole } from '../../domain/enums/AccountRole';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
	constructor(
		private readonly loginUseCase: LoginUseCase,
		private readonly assignAdminUseCase: AssignAdminUseCase,
	) {}

	@Public()
	@Post('/login')
	@ApiOperation({
		summary: 'Iniciar sesión',
		description: 'Autentica un usuario y devuelve un token JWT',
	})
	@ApiBody({ type: LoginDto })
	@ApiResponse({
		status: 201,
		description: 'Login exitoso. Retorna el token JWT.',
		type: SessionToken,
	})
	@ApiResponse({
		status: 401,
		description: 'Credenciales inválidas o cuenta deshabilitada',
	})
	async authenticate(@Body() body: LoginDto): Promise<SessionToken> {
		return this.loginUseCase.handle(body);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Patch('/assign-admin')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Asignar rol ADMIN',
		description:
			'Asigna el rol ADMIN a una cuenta existente. Solo admins pueden ejecutar esta acción.',
	})
	@ApiBody({ type: AssignAdminDto })
	@ApiResponse({ status: 204, description: 'Rol ADMIN asignado exitosamente' })
	@ApiResponse({ status: 404, description: 'Cuenta no encontrada' })
	async assignAdmin(@Body() body: AssignAdminDto): Promise<void> {
		return this.assignAdminUseCase.handle(body);
	}
}
