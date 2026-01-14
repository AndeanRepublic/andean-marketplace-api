import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionToken } from '../../../domain/entities/SessionToken';
import { AccountRepository } from '../../datastore/Account.repo';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { LoginDto } from '../../../infra/controllers/dto/LoginDto';
import { HashService } from '../../../infra/services/HashService';
import { Account } from '../../../domain/entities/Account';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AccountRepository)
    private readonly accountRepository: AccountRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handle(body: LoginDto): Promise<SessionToken> {
    const account = await this.accountRepository.getAccountByEmail(
      body.username,
    );
    if (!account || account.status != AccountStatus.ENABLED) {
      throw new UnauthorizedException();
    }
    const validPassword = await this.hashService.verify(
      account.password,
      body.password,
    );
    if (!validPassword) {
      throw new UnauthorizedException();
    }

    return await this.generateToken(account);
  }

  private async generateToken(account: Account): Promise<SessionToken> {
    const payload = { sub: account.userId, roles: account.roles };
    const jwtToken = await this.jwtService.signAsync(payload);
    return new SessionToken(
      jwtToken,
      this.configService.get('JWT_EXPIRES_IN') ?? 3600,
    );
  }
}
