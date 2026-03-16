import { Injectable, Inject } from '@nestjs/common';
import { SellerProfileRepository } from '../../app/datastore/Seller.repo';
import { CommunityRepository } from '../../app/datastore/community/community.repo';

/**
 * Servicio para resolver el nombre del propietario de un producto.
 * Soporta propietarios tipo SHOP (vendedor) y COMMUNITY (comunidad).
 */
@Injectable()
export class OwnerNameResolver {
	constructor(
		@Inject(SellerProfileRepository)
		private readonly sellerRepository: SellerProfileRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
	) { }

	/**
	 * Obtiene el nombre comercial del propietario según su tipo.
	 * @param ownerType - Tipo de propietario ('SHOP' o 'COMMUNITY')
	 * @param ownerId - ID del propietario
	 * @returns Nombre del propietario o un valor por defecto si no se encuentra.
	 */
	async resolve(ownerType: string, ownerId: string): Promise<string> {
		switch (ownerType) {
			case 'SHOP': {
				const seller = await this.sellerRepository.getSellerById(ownerId);
				return seller?.commercialName || 'Vendedor desconocido';
			}
			case 'COMMUNITY': {
				const community = await this.communityRepository.getById(ownerId);
				return community?.name || 'Comunidad desconocida';
			}
			default:
				return 'Propietario desconocido';
		}
	}
}
