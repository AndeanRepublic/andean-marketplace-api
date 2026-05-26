import { Injectable } from '@nestjs/common';
import { OrderFilterStrategy } from './OrderFilterStrategy';

/**
 * Estrategia de filtrado para usuarios USER.
 * Los usuarios regulares solo ven sus propias órdenes filtradas por customerId.
 */
@Injectable()
export class UserOrderFilterStrategy implements OrderFilterStrategy {
	async buildFilter(user: any): Promise<Record<string, any>> {
		return { customerId: user.userId };
	}
}
