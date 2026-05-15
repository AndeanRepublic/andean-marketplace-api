import { OrderResponse } from './OrderResponse';

/**
 * Response DTO para órdenes paginadas.
 * Sigue el mismo patrón que PaginatedProductsResponse usado en TextileProduct y Superfood.
 */
export interface PaginatedOrdersResponse {
	data: OrderResponse[];
	pagination: {
		total: number;
		page: number;
		per_page: number;
		total_pages: number;
	};
}
