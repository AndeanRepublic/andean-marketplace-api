import { ToolUsed } from '../../enums/ToolUsed';
import { ShippingMethod } from '../../enums/ShippingMethod';
import { ShippingRegion } from '../../enums/ShippingRegion';
import { ProductDimensions } from './ProductDimensions';

export class DetailTraceability {
	constructor(
		public isHandmade?: boolean,
		public secondaryMaterial?: string[],
		public originProductCommunityId?: string,
		public craftTechniqueId?: string,
		public toolUsed?: ToolUsed,
		public isArtisanExclusive?: boolean,
		public isOriginalCreation?: boolean,
		public isRegisteredDesign?: boolean,
		public availableUponRequest?: boolean,
		public leadTime?: number, // tiempo de reposicion en dias
		public certificationIds?: string[],
		public principalMaterial?: string[],
		public materialOrigin?: string,
		public customizable?: string,
		public hasCertifications?: boolean,
		public weightWithoutPackage?: number,
		public dimensionsWithoutPackage?: ProductDimensions,
		public packagingType?: string,
		public packageCustomization?: string[],
		public weightWithPackage?: number,
		public dimensionsWithPackage?: ProductDimensions,
		public shippingMethods?: ShippingMethod[],
		public shippingRegions?: ShippingRegion[],
		public estimatedDeliveryDays?: number,
	) {}
}
