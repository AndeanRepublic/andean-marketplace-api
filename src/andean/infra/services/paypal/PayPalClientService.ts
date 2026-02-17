import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';

interface AccessTokenCache {
	token: string;
	expiresAt: number;
}

@Injectable()
export class PayPalClientService {
	private readonly logger = new Logger(PayPalClientService.name);
	private client: paypal.core.PayPalHttpClient | null = null;
	private accessTokenCache: AccessTokenCache | null = null;
	private readonly clientId: string;
	private readonly clientSecret: string;
	private readonly environment: 'sandbox' | 'live';

	constructor(private readonly configService: ConfigService) {
		this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID') || '';
		this.clientSecret =
			this.configService.get<string>('PAYPAL_CLIENT_SECRET') || '';
		this.environment = (this.configService.get<string>('PAYPAL_ENVIRONMENT') ||
			'sandbox') as 'sandbox' | 'live';

		if (!this.clientId || !this.clientSecret) {
			this.logger.warn(
				'PayPal credentials not configured. PayPal features will not work.',
			);
		}
	}

	getClient(): paypal.core.PayPalHttpClient {
		if (!this.client) {
			const environment =
				this.environment === 'live'
					? new paypal.core.LiveEnvironment(this.clientId, this.clientSecret)
					: new paypal.core.SandboxEnvironment(
							this.clientId,
							this.clientSecret,
						);

			this.client = new paypal.core.PayPalHttpClient(environment);
		}

		return this.client;
	}

	// async getAccessToken(): Promise<string> {
	// 	// Verificar si hay token en cache y si aún no ha expirado
	// 	if (
	// 		this.accessTokenCache &&
	// 		this.accessTokenCache.expiresAt > Date.now()
	// 	) {
	// 		return this.accessTokenCache.token;
	// 	}

	// 	// Solicitar nuevo token
	// 	return this.refreshAccessToken();
	// }

	// async refreshAccessToken(): Promise<string> {
	// 	try {
	// 		const client = this.getClient();
	// 		const request = new paypal.core.AccessTokenRequest(
	// 			this.environment === 'live'
	// 				? paypal.core.Environment.Live
	// 				: paypal.core.Environment.Sandbox,
	// 		);

	// 		const response = await client.execute(request);

	// 		// PayPal tokens típicamente expiran en 32400 segundos (9 horas)
	// 		// Guardamos con un margen de seguridad de 5 minutos antes de expirar
	// 		const expiresIn = response.result.expires_in || 32400;
	// 		const expiresAt = Date.now() + (expiresIn - 300) * 1000;

	// 		this.accessTokenCache = {
	// 			token: response.result.access_token,
	// 			expiresAt,
	// 		};

	// 		this.logger.log('PayPal access token refreshed successfully');
	// 		return this.accessTokenCache.token;
	// 	} catch (error) {
	// 		this.logger.error('Failed to refresh PayPal access token', error);
	// 		throw error;
	// 	}
	// }
}
