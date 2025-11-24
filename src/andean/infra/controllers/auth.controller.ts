import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import { SessionToken } from '../../domain/entities/SessionToken';
import { LoginUseCase } from '../../app/use_cases/auth/LoginUseCase';

@Controller('/auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('/login')
  async authenticate(@Body() body: LoginDto): Promise<SessionToken> {
    return this.loginUseCase.handle(body);
  }
}
