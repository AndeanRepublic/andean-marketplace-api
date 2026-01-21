export interface TextileProductColorInfo {
	name: string;
	colorHexCode: string;
}

export interface TextileProductListItem {
	id: string;
	titulo: string;
	categoryName: string;
	productorName: string;
	colors: TextileProductColorInfo[];
	tallas: string[];
	principalImgUrl: string;
	price: number;
}
