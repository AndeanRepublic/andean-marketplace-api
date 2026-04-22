import React from 'react';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ResendEmailRepoImpl } from './email.resend.impl';
import { ResendClientService } from '../services/email/ResendClientService';
import { OrderConfirmationTemplate } from '../services/email/templates/OrderConfirmationTemplate';
import { PasswordResetCodeTemplate } from '../services/email/templates/PasswordResetCodeTemplate';
import {
	SendOrderConfirmationPayload,
	SendPasswordResetPayload,
} from '../../app/datastore/Email.repo';

describe('ResendEmailRepoImpl', () => {
	let emailRepo: ResendEmailRepoImpl;

	const mockSend = jest.fn();
	const mockResendClient = {
		emails: {
			send: mockSend,
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ResendEmailRepoImpl,
				{
					provide: ResendClientService,
					useValue: {
						getClient: () => mockResendClient,
						getSenderEmail: () => 'sender@example.com',
						getSenderName: () => 'Andean Marketplace',
					},
				},
			],
		}).compile();

		emailRepo = module.get<ResendEmailRepoImpl>(ResendEmailRepoImpl);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('sendOrderConfirmation', () => {
		const payload: SendOrderConfirmationPayload = {
			to: 'customer@example.com',
			data: {
				orderNumber: 'ORD-001',
				orderDate: new Date('2026-01-01'),
				customerName: 'John Doe',
				items: [{ name: 'Product 1', quantity: 2, unitPrice: 10, total: 20 }],
				summary: { subtotal: 20, shipping: 5, total: 25 },
				shippingAddress: '123 Main St, Lima, Peru',
			},
		};

		it('should use react property (not html) when sending order confirmation', async () => {
			mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null });

			await emailRepo.sendOrderConfirmation(payload);

			expect(mockSend).toHaveBeenCalledTimes(1);
			const callArgs = mockSend.mock.calls[0][0];
			expect(callArgs).toHaveProperty('react');
			expect(callArgs).not.toHaveProperty('html');
		});

		it('should pass React element created from OrderConfirmationTemplate', async () => {
			mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null });

			await emailRepo.sendOrderConfirmation(payload);

			const callArgs = mockSend.mock.calls[0][0];
			const reactElement = callArgs.react;
			expect(reactElement).toBeDefined();
			expect(reactElement.type).toBe(OrderConfirmationTemplate);
			expect(reactElement.props).toEqual({ data: payload.data });
		});

		it('should send to correct recipient with correct subject', async () => {
			mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null });

			await emailRepo.sendOrderConfirmation(payload);

			const callArgs = mockSend.mock.calls[0][0];
			expect(callArgs.to).toBe('customer@example.com');
			expect(callArgs.subject).toBe(
				`Order Confirmation #${payload.data.orderNumber}`,
			);
			expect(callArgs.from).toBe('Andean Marketplace <sender@example.com>');
		});

		it('should throw error when resend returns error response', async () => {
			mockSend.mockResolvedValue({
				data: null,
				error: { message: 'API rate limit exceeded' },
			});

			await expect(emailRepo.sendOrderConfirmation(payload)).rejects.toThrow(
				'Resend error: API rate limit exceeded',
			);
		});

		it('should re-throw when resend client throws', async () => {
			mockSend.mockRejectedValue(new Error('Network error'));

			await expect(emailRepo.sendOrderConfirmation(payload)).rejects.toThrow(
				'Network error',
			);
		});
	});

	describe('sendPasswordReset', () => {
		const payload: SendPasswordResetPayload = {
			to: 'user@example.com',
			data: { code: '123456' },
		};

		it('should use react property (not html) when sending password reset', async () => {
			mockSend.mockResolvedValue({ data: { id: 'email-456' }, error: null });

			await emailRepo.sendPasswordReset(payload);

			expect(mockSend).toHaveBeenCalledTimes(1);
			const callArgs = mockSend.mock.calls[0][0];
			expect(callArgs).toHaveProperty('react');
			expect(callArgs).not.toHaveProperty('html');
		});

		it('should pass React element created from PasswordResetCodeTemplate', async () => {
			mockSend.mockResolvedValue({ data: { id: 'email-456' }, error: null });

			await emailRepo.sendPasswordReset(payload);

			const callArgs = mockSend.mock.calls[0][0];
			const reactElement = callArgs.react;
			expect(reactElement).toBeDefined();
			expect(reactElement.type).toBe(PasswordResetCodeTemplate);
			expect(reactElement.props).toEqual({ code: payload.data.code });
		});

		it('should send to correct recipient with correct subject', async () => {
			mockSend.mockResolvedValue({ data: { id: 'email-456' }, error: null });

			await emailRepo.sendPasswordReset(payload);

			const callArgs = mockSend.mock.calls[0][0];
			expect(callArgs.to).toBe('user@example.com');
			expect(callArgs.subject).toBe('Reset your Andean Marketplace password');
			expect(callArgs.from).toBe('Andean Marketplace <sender@example.com>');
		});

		it('should throw error when resend returns error response', async () => {
			mockSend.mockResolvedValue({
				data: null,
				error: { message: 'Invalid API key' },
			});

			await expect(emailRepo.sendPasswordReset(payload)).rejects.toThrow(
				'Resend error: Invalid API key',
			);
		});

		it('should re-throw when resend client throws', async () => {
			mockSend.mockRejectedValue(new Error('Connection refused'));

			await expect(emailRepo.sendPasswordReset(payload)).rejects.toThrow(
				'Connection refused',
			);
		});
	});

	describe('constructor', () => {
		it('should be defined', () => {
			expect(emailRepo).toBeDefined();
		});
	});

	describe('logging', () => {
		let logSpy: jest.SpyInstance;

		beforeEach(() => {
			logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
		});

		afterEach(() => {
			logSpy.mockRestore();
		});

		it('should include [provider=resend] in success logs for order confirmation', async () => {
			mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null });

			await emailRepo.sendOrderConfirmation({
				to: 'customer@example.com',
				data: {
					orderNumber: 'ORD-001',
					orderDate: new Date(),
					customerName: 'John',
					items: [],
					summary: { subtotal: 0, shipping: 0, total: 0 },
					shippingAddress: 'address',
				},
			});

			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining('[provider=resend]'),
			);
		});

		it('should include [provider=resend] in success logs for password reset', async () => {
			mockSend.mockResolvedValue({ data: { id: 'email-456' }, error: null });

			await emailRepo.sendPasswordReset({
				to: 'user@example.com',
				data: { code: '123456' },
			});

			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining('[provider=resend]'),
			);
		});
	});
});
