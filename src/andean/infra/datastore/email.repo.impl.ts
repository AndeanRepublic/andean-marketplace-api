import { Injectable, Logger } from '@nestjs/common';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { render } from '@react-email/components';
import * as React from 'react';
import {
	EmailRepository,
	SendOrderConfirmationPayload,
	SendPasswordResetPayload,
	SendBookingConfirmationPayload,
	SendSellerApplicationDecisionPayload,
} from '../../app/datastore/Email.repo';
import { SesClientService } from '../services/email/SesClientService';
import { OrderConfirmationTemplate } from '../services/email/templates/OrderConfirmationTemplate';
import { PasswordResetCodeTemplate } from '../services/email/templates/PasswordResetCodeTemplate';
import { BookingConfirmationTemplate } from '../services/email/templates/BookingConfirmationTemplate';
import { SellerApplicationDecisionTemplate } from '../services/email/templates/SellerApplicationDecisionTemplate';
import { assertEmailSenderConfigured } from '../services/email/assertEmailSenderConfigured';

@Injectable()
export class SesEmailRepoImpl extends EmailRepository {
	private readonly logger = new Logger(SesEmailRepoImpl.name);

	constructor(private readonly sesClientService: SesClientService) {
		super();
	}

	/**
	 * Returns admin CC emails for production environments.
	 * @returns Array of admin emails if in production, empty array otherwise
	 */
	private getAdminCcEmails(): string[] {
		return process.env.NODE_ENV !== 'development'
			? ['hola@andeanrepublic.com']
			: [];
	}

	async sendOrderConfirmation(
		payload: SendOrderConfirmationPayload,
	): Promise<void> {
		const { to, cc, data } = payload;
		const senderEmail = this.sesClientService.getSenderEmail();
		assertEmailSenderConfigured(senderEmail, 'ses');

		const html = await render(
			React.createElement(OrderConfirmationTemplate, { data }),
		);

		const senderName = this.sesClientService.getSenderName();
		const ccAddresses = this.getAdminCcEmails();

		const command = new SendEmailCommand({
			Destination: {
				ToAddresses: [to],
				CcAddresses: ccAddresses.length > 0 ? ccAddresses : undefined,
			},
			Source: `${senderName} <${senderEmail}>`,
			Message: {
				Subject: {
					Data: `Order Confirmation #${data.orderNumber}`,
					Charset: 'UTF-8',
				},
				Body: {
					Html: {
						Data: html,
						Charset: 'UTF-8',
					},
				},
			},
		});

		await this.sesClientService.getClient().send(command);

		this.logger.log(
			`[provider=ses] Order confirmation email sent to ${to} for order #${data.orderNumber}`,
		);
	}

	async sendPasswordReset(payload: SendPasswordResetPayload): Promise<void> {
		const { to, data } = payload;

		const html = await render(
			React.createElement(PasswordResetCodeTemplate, { code: data.code }),
		);

		const senderEmail = this.sesClientService.getSenderEmail();
		const senderName = this.sesClientService.getSenderName();

		const command = new SendEmailCommand({
			Destination: {
				ToAddresses: [to],
			},
			Source: `${senderName} <${senderEmail}>`,
			Message: {
				Subject: {
					Data: 'Reset your Andean Marketplace password',
					Charset: 'UTF-8',
				},
				Body: {
					Html: {
						Data: html,
						Charset: 'UTF-8',
					},
				},
			},
		});

		await this.sesClientService.getClient().send(command);

		this.logger.log(`[provider=ses] Password reset email sent to ${to}`);
	}

	async sendBookingConfirmation(
		payload: SendBookingConfirmationPayload,
	): Promise<void> {
		const { to, cc, data } = payload;

		const html = await render(
			React.createElement(BookingConfirmationTemplate, { data }),
		);

		const senderEmail = this.sesClientService.getSenderEmail();
		const senderName = this.sesClientService.getSenderName();
		const ccAddresses = this.getAdminCcEmails();

		const command = new SendEmailCommand({
			Destination: {
				ToAddresses: [to],
				CcAddresses: ccAddresses.length > 0 ? ccAddresses : undefined,
			},
			Source: `${senderName} <${senderEmail}>`,
			Message: {
				Subject: {
					Data: `Booking Confirmation #${data.bookingNumber}`,
					Charset: 'UTF-8',
				},
				Body: {
					Html: {
						Data: html,
						Charset: 'UTF-8',
					},
				},
			},
		});

		await this.sesClientService.getClient().send(command);

		this.logger.log(
			`[provider=ses] Booking confirmation email sent to ${to} for booking #${data.bookingNumber}`,
		);
	}

	async sendSellerApplicationDecision(
		payload: SendSellerApplicationDecisionPayload,
	): Promise<void> {
		const { to, data } = payload;
		const senderEmail = this.sesClientService.getSenderEmail();
		assertEmailSenderConfigured(senderEmail, 'ses');

		const html = await render(
			React.createElement(SellerApplicationDecisionTemplate, { data }),
		);

		const senderName = this.sesClientService.getSenderName();
		const subject =
			data.decision === 'APPROVED'
				? 'Tu solicitud de vendedor fue aprobada — Andean Republic'
				: 'Actualización de tu solicitud de vendedor — Andean Republic';

		const command = new SendEmailCommand({
			Destination: { ToAddresses: [to] },
			Source: `${senderName} <${senderEmail}>`,
			Message: {
				Subject: { Data: subject, Charset: 'UTF-8' },
				Body: { Html: { Data: html, Charset: 'UTF-8' } },
			},
		});

		await this.sesClientService.getClient().send(command);

		this.logger.log(
			`[provider=ses] Seller application ${data.decision} email sent to ${to}`,
		);
	}
}
