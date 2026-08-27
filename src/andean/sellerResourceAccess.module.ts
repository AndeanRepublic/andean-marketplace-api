import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { ShopsModule } from './shop.module';
import { CommunityModule } from './community.module';
import { SellerResourceAccessService } from './infra/services/seller/SellerResourceAccessService';
import { GetSellerWorkspaceUseCase } from './app/use_cases/sellers/GetSellerWorkspaceUseCase';
import { SellerController } from './infra/controllers/seller.controller';

@Module({
	imports: [UsersModule, ShopsModule, CommunityModule],
	controllers: [SellerController],
	providers: [SellerResourceAccessService, GetSellerWorkspaceUseCase],
	exports: [SellerResourceAccessService],
})
export class SellerResourceAccessModule {}
