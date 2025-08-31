import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticateDto } from './dto/AuthenticateDto';
import { SessionToken } from '../../domain/entities/SessionToken';
import { LoginUseCase } from '../../app/use_cases/LoginUseCase';

@Controller('/auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('/')
  async authenticate(@Body() body: AuthenticateDto): Promise<SessionToken> {
    return this.loginUseCase.handle(body);
  }
}
