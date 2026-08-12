import {
	BadRequestException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { AccountRepository } from '../../datastore/Account.repo';
import { SellerApplicationDecision } from '../../../domain/enums/SellerApplicationDecision';
import { SellerStatus } from '../../../domain/enums/SellerStatus';
import { ShopStatus } from '../../../domain/enums/ShopStatus';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';
import { Shop } from '../../../domain/entities/shop/Shop';
import { SendSellerApplicationReviewEmailUseCase } from '../email/SendSellerApplicationReviewEmailUseCase';

@Injectable()
export class ReviewSellerApplicationUseCase {
	private readonly logger = new Logger(ReviewSellerApplicationUseCase.name);

	constructor(
		@Inject(SellerProfileRepository)
		private readonly sellerRepository: SellerProfileRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		private readonly sendSellerApplicationReviewEmailUseCase: SendSellerApplicationReviewEmailUseCase,
	) {}

	async handle(
		userId: string,
		decision: SellerApplicationDecision,
		rejectionReason?: string,
	): Promise<{ seller: ReturnType<typeof SellerProfileMapper.toResponse>; shops: Shop[] }> {
		if (!isValidObjectId(userId)) {
			throw new BadRequestException('Invalid user ID');
		}

		if (decision === SellerApplicationDecision.REJECTED) {
			const trimmed = rejectionReason?.trim();
			if (!trimmed) {
				throw new BadRequestException(
					'Debe indicar el motivo del rechazo (rejectionReason)',
				);
			}
			rejectionReason = trimmed;
		}

		const profile = await this.sellerRepository.getSellerByUserId(userId);
		if (!profile) {
			throw new NotFoundException('Seller profile not found');
		}

		if (profile.status !== SellerStatus.PENDING) {
			throw new BadRequestException(
				'La solicitud solo puede revisarse cuando el vendedor está en estado PENDING',
			);
		}

		const shops = await this.shopRepository.getAllBySellerId(profile.id);
		const pendingShops = shops.filter((s) => s.status === ShopStatus.PENDING);
		if (pendingShops.length === 0) {
			throw new BadRequestException(
				'No hay tiendas pendientes de revisión para este vendedor',
			);
		}

		const account = await this.accountRepository.getAccountById(userId);
		if (!account) {
			throw new NotFoundException('Account not found');
		}

		const shopName = pendingShops[0]?.name ?? 'Tu tienda';

		if (decision === SellerApplicationDecision.APPROVED) {
			await this.sellerRepository.updateReviewByUserId(
				userId,
				SellerStatus.APPROVED,
			);

			const updatedShops: Shop[] = [];
			for (const shop of pendingShops) {
				updatedShops.push(
					await this.shopRepository.updateStatus(shop.id, ShopStatus.ACTIVE),
				);
			}

			if (!account.roles.includes(AccountRole.SELLER)) {
				await this.accountRepository.updateAccountRoles(userId, [
					...account.roles,
					AccountRole.SELLER,
				]);
			}

			const updatedProfile =
				await this.sellerRepository.getSellerByUserId(userId);

			this.sendSellerApplicationReviewEmailUseCase
				.send({
					to: account.email,
					decision: SellerApplicationDecision.APPROVED,
					customerName: profile.name,
					shopName,
				})
				.catch((err) =>
					this.logger.error(
						`Failed to send seller application approval email for user ${userId}`,
						err instanceof Error ? err.stack : String(err),
					),
				);

			return {
				seller: SellerProfileMapper.toResponse(updatedProfile!),
				shops: updatedShops,
			};
		}

		await this.sellerRepository.updateReviewByUserId(
			userId,
			SellerStatus.REJECTED,
			rejectionReason,
		);

		const updatedShops: Shop[] = [];
		for (const shop of pendingShops) {
			updatedShops.push(
				await this.shopRepository.updateStatus(shop.id, ShopStatus.REJECTED),
			);
		}

		const rolesWithoutSeller = account.roles.filter(
			(r) => r !== AccountRole.SELLER,
		);
		if (rolesWithoutSeller.length !== account.roles.length) {
			await this.accountRepository.updateAccountRoles(
				userId,
				rolesWithoutSeller,
			);
		}

		const updatedProfile = await this.sellerRepository.getSellerByUserId(userId);

		this.sendSellerApplicationReviewEmailUseCase
			.send({
				to: account.email,
				decision: SellerApplicationDecision.REJECTED,
				customerName: profile.name,
				shopName,
				rejectionReason,
			})
			.catch((err) =>
				this.logger.error(
					`Failed to send seller application rejection email for user ${userId}`,
					err instanceof Error ? err.stack : String(err),
				),
			);

		return {
			seller: SellerProfileMapper.toResponse(updatedProfile!),
			shops: updatedShops,
		};
	}
}
