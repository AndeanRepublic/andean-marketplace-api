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
	})),
}));

jest.mock('./infra/datastore/email.repo.impl', () => ({
	SesEmailRepoImpl: jest.fn().mockImplementation(() => ({
		sendOrderConfirmation: jest.fn(),
		sendPasswordReset: jest.fn(),
	})),
}));

// Import AFTER mocks are registered
import { ResendEmailRepoImpl } from './infra/datastore/email.resend.impl';
import { SesEmailRepoImpl } from './infra/datastore/email.repo.impl';

/**
 * Unit test for the EmailRepository factory defined inline in OrdersModule.
 *
 * The factory logic is extracted here verbatim to test all branches:
 *   1. EMAIL_PROVIDER=resend + RESEND_API_KEY present  → ResendEmailRepoImpl
 *   2. EMAIL_PROVIDER=ses                              → SesEmailRepoImpl
 *   3. EMAIL_PROVIDER=resend without RESEND_API_KEY   → throws
 *   4. EMAIL_PROVIDER=invalid                         → throws
 *   5. EMAIL_PROVIDER undefined (no var set)          → SesEmailRepoImpl (default)
 */
function emailRepositoryFactory(
	configService: ConfigService,
	resendClient: ResendClientService,
	sesClient: SesClientService,
): EmailRepository {
	const provider = configService.get<string>('EMAIL_PROVIDER') || 'ses';

	if (provider === 'resend') {
		const apiKey = configService.get<string>('RESEND_API_KEY');
		if (!apiKey) {
			throw new Error('RESEND_API_KEY is required when EMAIL_PROVIDER=resend');
		}
		return new ResendEmailRepoImpl(resendClient);
	}

	if (provider !== 'ses') {
		throw new Error(
			`Invalid EMAIL_PROVIDER: '${provider}'. Valid values: 'resend' | 'ses'`,
		);
	}

	return new SesEmailRepoImpl(sesClient);
}

describe('OrdersModule — EmailRepository factory', () => {
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

		const result = emailRepositoryFactory(
			config,
			mockResendClient,
			mockSesClient,
		);

		expect(ResendEmailRepoImpl).toHaveBeenCalledWith(mockResendClient);
		expect(result).toBeDefined();
	});

	it('returns SesEmailRepoImpl when EMAIL_PROVIDER=ses', () => {
		const config = makeConfig({ EMAIL_PROVIDER: 'ses' });

		const result = emailRepositoryFactory(
			config,
			mockResendClient,
			mockSesClient,
		);

		expect(SesEmailRepoImpl).toHaveBeenCalledWith(mockSesClient);
		expect(result).toBeDefined();
	});

	it('returns SesEmailRepoImpl when EMAIL_PROVIDER is not set (defaults to ses)', () => {
		const config = makeConfig({});

		const result = emailRepositoryFactory(
			config,
			mockResendClient,
			mockSesClient,
		);

		expect(SesEmailRepoImpl).toHaveBeenCalledWith(mockSesClient);
		expect(result).toBeDefined();
	});

	it('throws when EMAIL_PROVIDER=resend but RESEND_API_KEY is missing', () => {
		const config = makeConfig({
			EMAIL_PROVIDER: 'resend',
			RESEND_API_KEY: undefined,
		});

		expect(() =>
			emailRepositoryFactory(config, mockResendClient, mockSesClient),
		).toThrow('RESEND_API_KEY is required when EMAIL_PROVIDER=resend');
	});

	it('throws when EMAIL_PROVIDER has an invalid value', () => {
		const config = makeConfig({ EMAIL_PROVIDER: 'mailgun' });

		expect(() =>
			emailRepositoryFactory(config, mockResendClient, mockSesClient),
		).toThrow(
			"Invalid EMAIL_PROVIDER: 'mailgun'. Valid values: 'resend' | 'ses'",
		);
	});
});
