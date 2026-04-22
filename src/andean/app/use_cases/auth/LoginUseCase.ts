import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionToken } from '../../models/users/SessionToken';
import { AccountRepository } from '../../datastore/Account.repo';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { CoinType } from '../../../domain/enums/CoinType';
import { LoginDto } from '../../../infra/controllers/dto/LoginDto';
import { HashService } from '../../../infra/services/HashService';
import { Account } from '../../../domain/entities/Account';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';

@Injectable()
export class LoginUseCase {
	constructor(
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerProfileRepository: CustomerProfileRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly hashService: HashService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly mediaUrlResolver: MediaUrlResolver,
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
		const payload = { sub: account.id, roles: account.roles };
		const jwtToken = await this.jwtService.signAsync(payload);

		// Fetch customer profile data (userId is FK to Account._id)
		const customerProfile =
			await this.customerProfileRepository.getCustomerByUserId(account.id);

		// Fetch profile picture URL if exists
		let profilePictureUrl = '';
		if (customerProfile?.profilePictureMediaId) {
			const mediaItem = await this.mediaItemRepository.getById(
				customerProfile.profilePictureMediaId,
			);
			if (mediaItem) {
				profilePictureUrl = this.mediaUrlResolver.resolveKey(mediaItem.key);
			}
		}

		return new SessionToken(
			jwtToken,
			this.configService.get('JWT_EXPIRES_IN') ?? 3600,
			account.id,
			account.name ?? '',
			account.email ?? '',
			customerProfile?.country ?? '',
			customerProfile?.phoneNumber ?? '',
			customerProfile?.language ?? '',
			customerProfile?.coin ?? CoinType.PEN,
			customerProfile?.birthDate?.toISOString().split('T')[0] ?? '',
			profilePictureUrl,
		);
	}
}
