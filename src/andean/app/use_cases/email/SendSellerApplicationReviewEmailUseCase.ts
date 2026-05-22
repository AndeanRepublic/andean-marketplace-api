import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailRepository } from '../../datastore/Email.repo';
import { SellerApplicationDecision } from '../../../domain/enums/SellerApplicationDecision';

export type SendSellerApplicationReviewParams = {
	to: string;
	decision: SellerApplicationDecision;
	customerName: string;
	shopName: string;
	rejectionReason?: string;
};

@Injectable()
export class SendSellerApplicationReviewEmailUseCase {
	private readonly logger = new Logger(SendSellerApplicationReviewEmailUseCase.name);

	constructor(
		@Inject(EmailRepository)
		private readonly emailRepository: EmailRepository,
	) {}

	async send(params: SendSellerApplicationReviewParams): Promise<void> {
		if (!params.to?.trim()) {
			this.logger.warn('No email address provided. Skipping seller application notification.');
			return;
		}

		const to = params.to.trim();
		await this.emailRepository.sendSellerApplicationDecision({
			to,
			data: {
				decision: params.decision,
				customerName: params.customerName,
				shopName: params.shopName,
				rejectionReason: params.rejectionReason,
			},
		});
		this.logger.log(
			`Seller application ${params.decision} email sent to ${to} for shop "${params.shopName}"`,
		);
	}
}
