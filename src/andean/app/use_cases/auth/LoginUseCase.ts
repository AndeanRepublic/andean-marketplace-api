import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SellerRepository } from '../../datastore/Seller.repo';
import { SessionToken } from '../../../domain/entities/SessionToken';
import { UserRepository } from '../../datastore/Customer.repo';
import { AccountRepository } from '../../datastore/Account.repo';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { AuthenticationDto } from '../../../infra/controllers/dto/AuthenticationDto';
import { HashService } from '../../../infra/services/HashService';
import { Account } from '../../../domain/entities/Account';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(SellerRepository)
    private readonly sellerRepository: SellerRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(AccountRepository)
    private readonly accountRepository: AccountRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handle(body: AuthenticationDto): Promise<SessionToken> {
    let userId = await this.userExistsAsUser(body.username);
    if (userId == '') {
      userId = await this.userExistsAsSeller(body.username);
      if (userId == '') {
        throw new UnauthorizedException();
      }
    }
    const account = await this.accountRepository.getAccountByUserId(userId);
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
    const payload = { sub: account.userId, role: account.type };
    const jwtToken = await this.jwtService.signAsync(payload);
    return new SessionToken(
      jwtToken,
      this.configService.get('JWT_EXPIRES_IN') ?? 3600,
    );
  }

  private async userExistsAsSeller(userName: string): Promise<string> {
    const foundByEmail = await this.sellerRepository.getSellerByEmail(userName);
    if (foundByEmail) return foundByEmail.id;
    const foundByPhone =
      await this.sellerRepository.getSellerByPhoneNumber(userName);
    if (foundByPhone) return foundByPhone.id;
    return '';
  }

  private async userExistsAsUser(userName: string): Promise<string> {
    const foundByEmail = await this.userRepository.getCustomerByEmail(userName);
    if (foundByEmail) return foundByEmail.id;
    const foundByPhone =
      await this.userRepository.getCustomerByPhoneNumber(userName);
    if (foundByPhone) return foundByPhone.id;
    return '';
  }
}
