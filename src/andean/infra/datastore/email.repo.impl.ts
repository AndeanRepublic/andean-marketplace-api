import { Injectable, Logger } from '@nestjs/common';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { render } from '@react-email/components';
import * as React from 'react';
import {
	EmailRepository,
	SendOrderConfirmationPayload,
} from '../../app/datastore/Email.repo';
import { SesClientService } from '../services/email/SesClientService';
import { OrderConfirmationTemplate } from '../services/email/templates/OrderConfirmationTemplate';

@Injectable()
export class SesEmailRepoImpl extends EmailRepository {
	private readonly logger = new Logger(SesEmailRepoImpl.name);

	constructor(private readonly sesClientService: SesClientService) {
		super();
	}

	async sendOrderConfirmation(
		payload: SendOrderConfirmationPayload,
	): Promise<void> {
		const { to, data } = payload;

		const html = await render(
			React.createElement(OrderConfirmationTemplate, { data }),
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
			`Order confirmation email sent to ${to} for order #${data.orderNumber}`,
		);
	}
}
