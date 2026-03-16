import { Injectable, Inject } from '@nestjs/common';
import { ShopRepository } from '../../app/datastore/Shop.repo';
import { CommunityRepository } from '../../app/datastore/community/community.repo';

/**
 * Servicio para resolver el nombre del propietario de un producto.
 * Soporta propietarios tipo SHOP (nombre de la tienda) y COMMUNITY (comunidad).
 */
@Injectable()
export class OwnerNameResolver {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
	) {}

	/**
	 * Obtiene el nombre del propietario según su tipo.
	 * Para SHOP usa el nombre de la tienda; para COMMUNITY el nombre de la comunidad.
	 * @param ownerType - Tipo de propietario ('SHOP' o 'COMMUNITY')
	 * @param ownerId - ID del propietario (sellerId para SHOP, communityId para COMMUNITY)
	 * @returns Nombre del propietario o un valor por defecto si no se encuentra.
	 */
	async resolve(ownerType: string, ownerId: string): Promise<string> {
		switch (ownerType) {
			case 'SHOP': {
				const shops = await this.shopRepository.getAllBySellerId(ownerId);
				return shops[0]?.name || 'Vendedor desconocido';
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
