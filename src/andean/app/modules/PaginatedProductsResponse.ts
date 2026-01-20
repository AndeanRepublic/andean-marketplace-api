export interface PaginatedProductsResponse<T> {
	products: T[];
	pagination: {
		total: number;
		page: number;
		per_page: number;
	};
}
