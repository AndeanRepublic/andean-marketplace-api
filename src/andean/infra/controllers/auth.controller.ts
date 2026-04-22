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
import { ForgotPasswordDto } from './dto/ForgotPasswordDto';
import { ResetPasswordDto } from './dto/ResetPasswordDto';
import { VerifyResetCodeDto } from './dto/VerifyResetCodeDto';
import { SessionToken } from '../../app/models/users/SessionToken';
import { LoginUseCase } from '../../app/use_cases/auth/LoginUseCase';
import { AssignAdminUseCase } from '../../app/use_cases/auth/AssignAdminUseCase';
import { ForgotPasswordUseCase } from '../../app/use_cases/auth/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../app/use_cases/auth/ResetPasswordUseCase';
import { VerifyResetCodeUseCase } from '../../app/use_cases/auth/VerifyResetCodeUseCase';
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
		private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
		private readonly resetPasswordUseCase: ResetPasswordUseCase,
		private readonly verifyResetCodeUseCase: VerifyResetCodeUseCase,
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

	@Public()
	@Post('/forgot-password')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Solicitar restablecimiento de contraseña',
		description:
			'Envía un código de 6 dígitos al email si la cuenta existe. Siempre retorna éxito para evitar enumeración.',
	})
	@ApiBody({ type: ForgotPasswordDto })
	@ApiResponse({
		status: 200,
		description:
			'Código enviado (o ignorado silenciosamente si el email no existe)',
	})
	async forgotPassword(
		@Body() dto: ForgotPasswordDto,
	): Promise<{ message: string }> {
		await this.forgotPasswordUseCase.execute(dto.email);
		return { message: 'If the email exists, a reset code has been sent.' };
	}

	@Public()
	@Post('/verify-reset-code')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Verificar código de restablecimiento',
		description:
			'Valida el código de 6 dígitos y retorna un JWT de corta duración (5 min) para autorizar el cambio de contraseña.',
	})
	@ApiBody({ type: VerifyResetCodeDto })
	@ApiResponse({
		status: 200,
		description: 'Código válido. Retorna resetToken JWT.',
	})
	@ApiResponse({
		status: 400,
		description:
			'Código inválido, expirado, ya usado o máximo de intentos alcanzado',
	})
	async verifyResetCode(
		@Body() dto: VerifyResetCodeDto,
	): Promise<{ resetToken: string }> {
		return this.verifyResetCodeUseCase.execute(dto.email, dto.code);
	}

	@Public()
	@Post('/reset-password')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Restablecer contraseña',
		description:
			'Usa el resetToken obtenido en verify-reset-code para actualizar la contraseña del usuario.',
	})
	@ApiBody({ type: ResetPasswordDto })
	@ApiResponse({
		status: 200,
		description: 'Contraseña restablecida exitosamente',
	})
	@ApiResponse({
		status: 400,
		description: 'Reset token inválido o expirado',
	})
	async resetPassword(
		@Body() dto: ResetPasswordDto,
	): Promise<{ message: string }> {
		await this.resetPasswordUseCase.execute(dto.resetToken, dto.newPassword);
		return { message: 'Password has been reset successfully.' };
	}
}
