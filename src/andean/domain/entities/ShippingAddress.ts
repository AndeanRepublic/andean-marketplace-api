import { AdministrativeArea } from './order/Order';

/**
 * ShippingAddress entity para guardar direcciones de usuarios
 * No se relaciona con Order - Order copia los datos al crear la orden
 */
export class ShippingAddress {
	constructor(
		public id: string,
		public customerId: string,
		public recipientName: string,
		public phone: string,
		public countryCode: string,
		public country: string,
		public city: string,
		public administrativeArea: AdministrativeArea,
		public addressLine1: string,
		public addressLine2: string | undefined,
		public postalCode: string | undefined,
		public isDefault: boolean,
		public createdAt: Date,
		public updatedAt: Date,
	) {}
}
