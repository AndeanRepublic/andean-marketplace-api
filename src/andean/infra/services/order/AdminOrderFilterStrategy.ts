import { Injectable } from '@nestjs/common';
import { OrderFilterStrategy } from './OrderFilterStrategy';

/**
 * Estrategia de filtrado para usuarios ADMIN.
 * Los administradores ven TODAS las órdenes sin restricciones.
 */
@Injectable()
export class AdminOrderFilterStrategy implements OrderFilterStrategy {
	async buildFilter(user: any): Promise<Record<string, any>> {
		// Admin ve todas las órdenes - sin filtro
		return {};
	}
}
