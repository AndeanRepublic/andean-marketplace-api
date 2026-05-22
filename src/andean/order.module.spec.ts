import { ConfigService } from '@nestjs/config';
import { EmailRepository } from './app/datastore/Email.repo';
import { ResendClientService } from './infra/services/email/ResendClientService';
import { SesClientService } from './infra/services/email/SesClientService';

// Mock the concrete implementations to avoid resolving their transitive
// dependencies (React Email templates). The factory only checks instanceof,
// so shallow mocks are enough.
jest.mock('./infra/datastore/email.resend.impl', () => ({
	ResendEmailRepoImpl: jest.fn().mockImplementation(() => ({
		sendOrderConfirmation: jest.fn(),
		sendPasswordReset: jest.fn(),
		sendBookingConfirmation: jest.fn(),
		sendSellerApplicationDecision: jest.fn(),
	})),
}));

jest.mock('./infra/datastore/email.repo.impl', () => ({
	SesEmailRepoImpl: jest.fn().mockImplementation(() => ({
		sendOrderConfirmation: jest.fn(),
		sendPasswordReset: jest.fn(),
		sendBookingConfirmation: jest.fn(),
		sendSellerApplicationDecision: jest.fn(),
	})),
}));

// Import AFTER mocks are registered
import { ResendEmailRepoImpl } from './infra/datastore/email.resend.impl';
import { SesEmailRepoImpl } from './infra/datastore/email.repo.impl';
import { createEmailRepository } from './infra/services/email/createEmailRepository';

describe('EmailRepository factory', () => {
	const mockResendClient = {} as ResendClientService;
	const mockSesClient = {} as SesClientService;

	function makeConfig(env: Record<string, string | undefined>): ConfigService {
		return {
			get: (key: string) => env[key],
		} as unknown as ConfigService;
	}

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns ResendEmailRepoImpl when EMAIL_PROVIDER=resend and RESEND_API_KEY is present', () => {
		const config = makeConfig({
			EMAIL_PROVIDER: 'resend',
			RESEND_API_KEY: 're_test_key',
		});

		const result = createEmailRepository(
			config,
			mockResendClient,
			mockSesClient,
		);

		expect(ResendEmailRepoImpl).toHaveBeenCalledWith(mockResendClient);
		expect(result).toBeDefined();
	});

	it('returns SesEmailRepoImpl when EMAIL_PROVIDER=ses', () => {
		const config = makeConfig({ EMAIL_PROVIDER: 'ses' });

		const result = createEmailRepository(
			config,
			mockResendClient,
			mockSesClient,
		);

		expect(SesEmailRepoImpl).toHaveBeenCalledWith(mockSesClient);
		expect(result).toBeDefined();
	});

	it('returns SesEmailRepoImpl when EMAIL_PROVIDER is not set and SES sender is configured', () => {
		const config = makeConfig({
			SES_SENDER_EMAIL: 'noreply@example.com',
		});

		const result = createEmailRepository(
			config,
			mockResendClient,
			mockSesClient,
		);

		expect(SesEmailRepoImpl).toHaveBeenCalledWith(mockSesClient);
		expect(result).toBeDefined();
	});

	it('returns ResendEmailRepoImpl when SES sender is missing but Resend is configured', () => {
		const config = makeConfig({
			EMAIL_PROVIDER: 'ses',
			RESEND_API_KEY: 're_test_key',
			RESEND_SENDER_EMAIL: 'noreply@example.com',
		});

		const result = createEmailRepository(
			config,
			mockResendClient,
			mockSesClient,
		);

		expect(ResendEmailRepoImpl).toHaveBeenCalledWith(mockResendClient);
		expect(result).toBeDefined();
	});

	it('throws when EMAIL_PROVIDER=resend but RESEND_API_KEY is missing', () => {
		const config = makeConfig({
			EMAIL_PROVIDER: 'resend',
			RESEND_API_KEY: undefined,
		});

		expect(() =>
			createEmailRepository(config, mockResendClient, mockSesClient),
		).toThrow('RESEND_API_KEY is required when EMAIL_PROVIDER=resend');
	});

	it('throws when EMAIL_PROVIDER has an invalid value', () => {
		const config = makeConfig({ EMAIL_PROVIDER: 'mailgun' });

		expect(() =>
			createEmailRepository(config, mockResendClient, mockSesClient),
		).toThrow(
			"Invalid EMAIL_PROVIDER: 'mailgun'. Valid values: 'resend' | 'ses'",
		);
	});
});
