import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/LoginDto';
import { SessionToken } from '../../domain/entities/SessionToken';
import { LoginUseCase } from '../../app/use_cases/auth/LoginUseCase';
import { Public } from '../core/public.decorator';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
	constructor(private readonly loginUseCase: LoginUseCase) {}

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
}
