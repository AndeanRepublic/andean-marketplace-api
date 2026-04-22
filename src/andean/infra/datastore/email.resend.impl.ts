import { Injectable, Logger } from '@nestjs/common';
import React from 'react';
import {
	EmailRepository,
	SendOrderConfirmationPayload,
	SendPasswordResetPayload,
} from '../../app/datastore/Email.repo';
import { ResendClientService } from '../services/email/ResendClientService';
import { OrderConfirmationTemplate } from '../services/email/templates/OrderConfirmationTemplate';
import { PasswordResetCodeTemplate } from '../services/email/templates/PasswordResetCodeTemplate';

@Injectable()
export class ResendEmailRepoImpl extends EmailRepository {
	private readonly logger = new Logger(ResendEmailRepoImpl.name);

	constructor(private readonly resendClientService: ResendClientService) {
		super();
	}

	async sendOrderConfirmation(
		payload: SendOrderConfirmationPayload,
	): Promise<void> {
		const { to, data } = payload;

		const senderEmail = this.resendClientService.getSenderEmail();
		const senderName = this.resendClientService.getSenderName();

		try {
			const { data: resendData, error } = await this.resendClientService
				.getClient()
				.emails.send({
					from: `${senderName} <${senderEmail}>`,
					to: to,
					subject: `Order Confirmation #${data.orderNumber}`,
					react: React.createElement(OrderConfirmationTemplate, { data }),
				});

			if (error) {
				this.logger.error(
					`[provider=resend] Failed to send order confirmation email to ${to}: ${error.message}`,
				);
				throw new Error(`Resend error: ${error.message}`);
			}

			this.logger.log(
				`[provider=resend] Order confirmation email sent to ${to} for order #${data.orderNumber}`,
			);
		} catch (error) {
			this.logger.error(
				`Error sending order confirmation to ${to}: ${error.message}`,
			);
			throw error;
		}
	}

	async sendPasswordReset(payload: SendPasswordResetPayload): Promise<void> {
		const { to, data } = payload;

		const senderEmail = this.resendClientService.getSenderEmail();
		const senderName = this.resendClientService.getSenderName();

		try {
			const { data: resendData, error } = await this.resendClientService
				.getClient()
				.emails.send({
					from: `${senderName} <${senderEmail}>`,
					to: to,
					subject: 'Reset your Andean Marketplace password',
					react: React.createElement(PasswordResetCodeTemplate, {
						code: data.code,
					}),
				});

			if (error) {
				this.logger.error(
					`[provider=resend] Failed to send password reset email to ${to}: ${error.message}`,
				);
				throw new Error(`Resend error: ${error.message}`);
			}

			this.logger.log(`[provider=resend] Password reset email sent to ${to}`);
		} catch (error) {
			this.logger.error(
				`Error sending password reset to ${to}: ${error.message}`,
			);
			throw error;
		}
	}
}
