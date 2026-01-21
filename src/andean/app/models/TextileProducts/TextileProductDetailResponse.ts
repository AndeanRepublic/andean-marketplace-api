export class TextileProductDetailResponse {
	name: string;
	availableSizes: string[]; 
	availableColors: string[];
	availableMaterials: string[];
	variantInfo: {
		size: string;
		color: string;
		material: string;
		price: number;
		stock: number;
	}[];
	generalStock: number;
	information: string;
	description: string;
	traceabilityInfo: {
		origen: {
			title: string;
			supplier: string;
			country: string;
			city: string;
			description: string;
		}[];
		processing: {
			title: string;
			supplier: string;
			country: string;
			city: string;
			description: string;
		}[];
		development: {
			title: string;
			supplier: string;
			country: string;
			city: string;
			description: string;
		}[];
		merchandising: {
			title: string;
			supplier: string;
			country: string;
			city: string;
			description: string;
		}[];
	};
	reviews: {
		rating: {
			count5stars: number;
			count4stars: number;
			count3stars: number;
			count2stars: number;
			count1star: number;
			totalReviews: number;
			averagePunctuation: number;
		};
		comments: {
			nameUser: string;
			content: string;
			numberStarts: number;
			date: Date;
			likes: number;
			dislikes: number;
		}[];
	};
	similarProducts: {
		title: string;
		categoryName: string;
		productorName: string;
		colors: {
			colorName: string;
			colorHexCode: string;
		}[];
		sizes: string[];
		principalImgUrl: string;
		price: number;
	}[];
	communityInfo?: {
		imgUrl: string;
		name: string;
		seals: {
			title: string;
			description: string;
			logoUrl: string;
		}[];
	};
}