import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface DiscountCodeValidationResult {
	isValid: boolean;
	percentage?: number;
}

@Injectable()
export class DiscountCodeService {
	private readonly logger = new Logger(DiscountCodeService.name);
	private readonly apiUrl: string;
	private readonly timeout: number;

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {
		this.apiUrl =
			this.configService.get<string>('DISCOUNT_API_URL') ||
			'http://localhost:3001';
		this.timeout =
			this.configService.get<number>('DISCOUNT_API_TIMEOUT') || 5000;
	}

	async validateDiscountCode(
		code: string,
		customerId: string,
	): Promise<DiscountCodeValidationResult> {
		try {
			const response = await firstValueFrom(
				this.httpService.post<{ valid: boolean; percentage?: number }>(
					`${this.apiUrl}/validate-discount-code`,
					{
						code,
						customerId,
					},
					{
						timeout: this.timeout,
					},
				),
			);

			if (response.data.valid) {
				return {
					isValid: true,
					percentage: response.data.percentage,
				};
			}

			return {
				isValid: false,
			};
		} catch (error) {
			this.logger.error(
				`Error validating discount code: ${error instanceof AxiosError ? error.message : 'Unknown error'}`,
			);

			// En caso de error, retornar código inválido
			return {
				isValid: false,
			};
		}
	}
}
