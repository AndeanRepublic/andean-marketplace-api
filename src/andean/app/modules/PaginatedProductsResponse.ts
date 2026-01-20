export interface FilterCountItem {
	label: string;
	count: number;
}

export interface FilterCount {
	colors?: FilterCountItem[];
	sizes?: FilterCountItem[];
	communities?: FilterCountItem[];
	categories?: FilterCountItem[];
}

export interface PaginatedProductsResponse<T> {
	products: T[];
	pagination: {
		total: number;
		page: number;
		per_page: number;
	};
	filterCount?: FilterCount;
}
