import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ResendClientService } from './ResendClientService';
import { Resend } from 'resend';

describe('ResendClientService', () => {
	let service: ResendClientService;
	let configService: ConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ResendClientService,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							switch (key) {
								case 'RESEND_API_KEY':
									return 'test-api-key';
								case 'RESEND_SENDER_EMAIL':
									return 'test@example.com';
								case 'RESEND_SENDER_NAME':
									return 'Test Sender';
								default:
									return null;
							}
						}),
					},
				},
			],
		}).compile();

		service = module.get<ResendClientService>(ResendClientService);
		configService = module.get<ConfigService>(ConfigService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getClient', () => {
		it('should return a Resend client instance', () => {
			const client = service.getClient();
			expect(client).toBeInstanceOf(Resend);
		});

		it('should initialize client only once', () => {
			const client1 = service.getClient();
			const client2 = service.getClient();
			expect(client1).toBe(client2);
		});

		it('should throw an error when RESEND_API_KEY is not configured', () => {
			jest.spyOn(configService, 'get').mockImplementation((key: string) => {
				if (key === 'RESEND_API_KEY') return null;
				return null;
			});

			const serviceWithoutKey = new ResendClientService(configService);
			expect(() => serviceWithoutKey.getClient()).toThrow(
				'RESEND_API_KEY is required',
			);
		});
	});

	describe('getSenderEmail', () => {
		it('should return the sender email from config', () => {
			const email = service.getSenderEmail();
			expect(email).toBe('test@example.com');
		});

		it('should return empty string when sender email is not configured', () => {
			jest.spyOn(configService, 'get').mockImplementation((key: string) => {
				if (key === 'RESEND_SENDER_EMAIL') return null;
				if (key === 'SES_SENDER_EMAIL') return null;
				return null;
			});

			const newService = new ResendClientService(configService);
			expect(newService.getSenderEmail()).toBe('');
		});
	});

	describe('getSenderName', () => {
		it('should return the sender name from config', () => {
			const name = service.getSenderName();
			expect(name).toBe('Test Sender');
		});

		it('should return default name when sender name is not configured', () => {
			jest.spyOn(configService, 'get').mockImplementation((key: string) => {
				if (key === 'RESEND_SENDER_NAME') return null;
				if (key === 'SES_SENDER_NAME') return null;
				return null;
			});

			const newService = new ResendClientService(configService);
			expect(newService.getSenderName()).toBe('Andean Marketplace');
		});
	});
});
