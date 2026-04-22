import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { SesEmailRepoImpl } from './email.repo.impl';
import { SesClientService } from '../services/email/SesClientService';
import { OrderConfirmationTemplate } from '../services/email/templates/OrderConfirmationTemplate';
import { PasswordResetCodeTemplate } from '../services/email/templates/PasswordResetCodeTemplate';
import {
	SendOrderConfirmationPayload,
	SendPasswordResetPayload,
} from '../../app/datastore/Email.repo';

// Mock heavy AWS SDK and @react-email/components to keep unit test lean
jest.mock('@aws-sdk/client-ses', () => ({
	SendEmailCommand: jest.fn().mockImplementation((params) => params),
}));

jest.mock('@react-email/components', () => ({
	render: jest.fn().mockResolvedValue('<html>mocked</html>'),
}));

describe('SesEmailRepoImpl', () => {
	let emailRepo: SesEmailRepoImpl;
	let logSpy: jest.SpyInstance;

	const mockSend = jest.fn();
	const mockSesClient = {
		send: mockSend,
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SesEmailRepoImpl,
				{
					provide: SesClientService,
					useValue: {
						getClient: () => mockSesClient,
						getSenderEmail: () => 'ses-sender@example.com',
						getSenderName: () => 'Andean Marketplace SES',
					},
				},
			],
		}).compile();

		emailRepo = module.get<SesEmailRepoImpl>(SesEmailRepoImpl);
		logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
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

		it('should log with [provider=ses] when order confirmation email is sent', async () => {
			mockSend.mockResolvedValue({});

			await emailRepo.sendOrderConfirmation(payload);

			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining('[provider=ses]'),
			);
		});

		it('should include recipient and order number in log message', async () => {
			mockSend.mockResolvedValue({});

			await emailRepo.sendOrderConfirmation(payload);

			expect(logSpy).toHaveBeenCalledWith(
				expect.stringMatching(
					/\[provider=ses\] Order confirmation email sent to customer@example\.com for order #ORD-001/,
				),
			);
		});

		it('should send order confirmation email successfully', async () => {
			mockSend.mockResolvedValue({});

			await expect(
				emailRepo.sendOrderConfirmation(payload),
			).resolves.toBeUndefined();

			expect(mockSend).toHaveBeenCalledTimes(1);
		});

		it('should re-throw when SES client throws', async () => {
			mockSend.mockRejectedValue(new Error('SES error'));

			await expect(emailRepo.sendOrderConfirmation(payload)).rejects.toThrow(
				'SES error',
			);
		});
	});

	describe('sendPasswordReset', () => {
		const payload: SendPasswordResetPayload = {
			to: 'user@example.com',
			data: { code: '654321' },
		};

		it('should log with [provider=ses] when password reset email is sent', async () => {
			mockSend.mockResolvedValue({});

			await emailRepo.sendPasswordReset(payload);

			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining('[provider=ses]'),
			);
		});

		it('should include recipient in log message', async () => {
			mockSend.mockResolvedValue({});

			await emailRepo.sendPasswordReset(payload);

			expect(logSpy).toHaveBeenCalledWith(
				expect.stringMatching(
					/\[provider=ses\] Password reset email sent to user@example\.com/,
				),
			);
		});

		it('should send password reset email successfully', async () => {
			mockSend.mockResolvedValue({});

			await expect(
				emailRepo.sendPasswordReset(payload),
			).resolves.toBeUndefined();

			expect(mockSend).toHaveBeenCalledTimes(1);
		});

		it('should re-throw when SES client throws', async () => {
			mockSend.mockRejectedValue(new Error('SES network error'));

			await expect(emailRepo.sendPasswordReset(payload)).rejects.toThrow(
				'SES network error',
			);
		});
	});

	describe('constructor', () => {
		it('should be defined', () => {
			expect(emailRepo).toBeDefined();
		});
	});
});
