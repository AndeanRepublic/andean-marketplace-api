import { Injectable } from '@nestjs/common';
import { SellerWorkspaceResponse } from '../../models/users/SellerWorkspaceResponse';
import { SellerResourceAccessService } from '../../../infra/services/seller/SellerResourceAccessService';

@Injectable()
export class GetSellerWorkspaceUseCase {
	constructor(
		private readonly sellerResourceAccess: SellerResourceAccessService,
	) {}

	async handle(userId: string): Promise<SellerWorkspaceResponse> {
		const workspace = await this.sellerResourceAccess.resolveWorkspace(userId);
		return {
			sellerId: workspace.sellerId,
			catalogs: workspace.catalogs,
			shopIds: workspace.shopIds,
			communityIds: workspace.communityIds,
			shops: workspace.shops,
		};
	}
}
