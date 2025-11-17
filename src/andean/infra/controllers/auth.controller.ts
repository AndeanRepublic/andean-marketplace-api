import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationDto } from './dto/AuthenticationDto';
import { SessionToken } from '../../domain/entities/SessionToken';
import { LoginUseCase } from '../../app/use_cases/auth/LoginUseCase';

@Controller('/auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('/login')
  async authenticate(@Body() body: AuthenticationDto): Promise<SessionToken> {
    return this.loginUseCase.handle(body);
  }
}
