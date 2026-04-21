import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { ShopsModule } from './shop.module';
import { CommunityModule } from './community.module';
import { SellerResourceAccessService } from './infra/services/seller/SellerResourceAccessService';

@Module({
	imports: [UsersModule, ShopsModule, CommunityModule],
	providers: [SellerResourceAccessService],
	exports: [SellerResourceAccessService],
})
export class SellerResourceAccessModule {}
