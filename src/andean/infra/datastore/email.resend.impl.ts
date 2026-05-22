import { Injectable, Logger } from '@nestjs/common';
import React from 'react';
import {
	EmailRepository,
	SendOrderConfirmationPayload,
	SendPasswordResetPayload,
	SendBookingConfirmationPayload,
	SendSellerApplicationDecisionPayload,
} from '../../app/datastore/Email.repo';
import { ResendClientService } from '../services/email/ResendClientService';
import { OrderConfirmationTemplate } from '../services/email/templates/OrderConfirmationTemplate';
import { PasswordResetCodeTemplate } from '../services/email/templates/PasswordResetCodeTemplate';
import { BookingConfirmationTemplate } from '../services/email/templates/BookingConfirmationTemplate';
import { SellerApplicationDecisionTemplate } from '../services/email/templates/SellerApplicationDecisionTemplate';
import { assertEmailSenderConfigured } from '../services/email/assertEmailSenderConfigured';

@Injectable()
export class ResendEmailRepoImpl extends EmailRepository {
	private readonly logger = new Logger(ResendEmailRepoImpl.name);

	constructor(private readonly resendClientService: ResendClientService) {
		super();
	}

	/**
	 * Returns admin CC emails for production environments.
	 * @returns Array of admin emails if in production, undefined otherwise
	 */
	private getAdminCcEmails(): string[] | undefined {
		return process.env.NODE_ENV !== 'development'
			? ['hola@andeanrepublic.com']
			: undefined;
	}

	async sendOrderConfirmation(
		payload: SendOrderConfirmationPayload,
	): Promise<void> {
		const { to, cc, data } = payload;

		const senderEmail = this.resendClientService.getSenderEmail();
		const senderName = this.resendClientService.getSenderName();
		const ccEmails = this.getAdminCcEmails();

		try {
			const { data: resendData, error } = await this.resendClientService
				.getClient()
				.emails.send({
					from: `${senderName} <${senderEmail}>`,
					to: to,
					cc: ccEmails,
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

	async sendBookingConfirmation(
		payload: SendBookingConfirmationPayload,
	): Promise<void> {
		const { to, cc, data } = payload;

		const senderEmail = this.resendClientService.getSenderEmail();
		const senderName = this.resendClientService.getSenderName();
		const ccEmails = this.getAdminCcEmails();

		try {
			const { data: resendData, error } = await this.resendClientService
				.getClient()
				.emails.send({
					from: `${senderName} <${senderEmail}>`,
					to: to,
					cc: ccEmails,
					subject: `Booking Confirmation #${data.bookingNumber}`,
					react: React.createElement(BookingConfirmationTemplate, { data }),
				});

			if (error) {
				this.logger.error(
					`[provider=resend] Failed to send booking confirmation email to ${to}: ${error.message}`,
				);
				throw new Error(`Resend error: ${error.message}`);
			}

			this.logger.log(
				`[provider=resend] Booking confirmation email sent to ${to} for booking #${data.bookingNumber}`,
			);
		} catch (error) {
			this.logger.error(
				`Error sending booking confirmation to ${to}: ${error.message}`,
			);
			throw error;
		}
	}

	async sendSellerApplicationDecision(
		payload: SendSellerApplicationDecisionPayload,
	): Promise<void> {
		const { to, data } = payload;
		const senderEmail = this.resendClientService.getSenderEmail();
		assertEmailSenderConfigured(senderEmail, 'resend');
		const senderName = this.resendClientService.getSenderName();
		const subject =
			data.decision === 'APPROVED'
				? 'Tu solicitud de vendedor fue aprobada — Andean Republic'
				: 'Actualización de tu solicitud de vendedor — Andean Republic';

		try {
			const { error } = await this.resendClientService.getClient().emails.send({
				from: `${senderName} <${senderEmail}>`,
				to,
				subject,
				react: React.createElement(SellerApplicationDecisionTemplate, { data }),
			});

			if (error) {
				this.logger.error(
					`[provider=resend] Failed to send seller application decision email to ${to}: ${error.message}`,
				);
				throw new Error(`Resend error: ${error.message}`);
			}

			this.logger.log(
				`[provider=resend] Seller application ${data.decision} email sent to ${to}`,
			);
		} catch (error) {
			this.logger.error(
				`Error sending seller application decision to ${to}: ${error.message}`,
			);
			throw error;
		}
	}
}
