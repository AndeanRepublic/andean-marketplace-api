import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SellerRepository } from '../../../users/app/datastore/Seller.repo';
import { SessionToken } from '../../domain/entities/SessionToken';
import { UserRepository } from '../../../users/app/datastore/User.repo';
import { AccountRepository } from '../datastore/Account.repo';
import { AccountStatus } from '../../domain/enums/AccountStatus';
import { AuthenticateDto } from '../../infra/controllers/dto/AuthenticateDto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(SellerRepository)
    @Inject(UserRepository)
    @Inject(AccountRepository)
    private readonly sellerRepository: SellerRepository,
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async handle(body: AuthenticateDto): Promise<SessionToken> {
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
    if (account.password !== body.password) {
      throw new UnauthorizedException();
    }
    return new SessionToken('', 1500);
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
    const foundByEmail = await this.userRepository.getUserByEmail(userName);
    if (foundByEmail) return foundByEmail.id;
    const foundByPhone =
      await this.userRepository.getUserByPhoneNumber(userName);
    if (foundByPhone) return foundByPhone.id;
    return '';
  }
}
