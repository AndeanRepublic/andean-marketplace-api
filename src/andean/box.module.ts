import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { BoxSchema } from './infra/persistence/box/box.schema';

// Repository
import { BoxRepository } from './app/datastore/box/Box.repo';
import { BoxRepoImpl } from './infra/datastore/box/box.repo.impl';

// Use Cases
import { CreateBoxUseCase } from './app/use_cases/boxes/CreateBoxUseCase';
import { GetAllBoxesUseCase } from './app/use_cases/boxes/GetAllBoxesUseCase';
import { GetBoxDetailUseCase } from './app/use_cases/boxes/GetBoxDetailUseCase';
import { GetBoxCatalogSuperfoodsUseCase } from './app/use_cases/boxes/GetBoxCatalogSuperfoodsUseCase';
import { GetBoxCatalogTextileProductsUseCase } from './app/use_cases/boxes/GetBoxCatalogTextileProductsUseCase';
import { GetBoxCatalogTextileVariantsUseCase } from './app/use_cases/boxes/GetBoxCatalogTextileVariantsUseCase';
import { GetBoxCatalogSuperfoodVariantsUseCase } from './app/use_cases/boxes/GetBoxCatalogSuperfoodVariantsUseCase';
import { GetBoxCatalogTextileProductMediaUseCase } from './app/use_cases/boxes/GetBoxCatalogTextileProductMediaUseCase';
import { GetBoxCatalogSuperfoodProductMediaUseCase } from './app/use_cases/boxes/GetBoxCatalogSuperfoodProductMediaUseCase';
import { UpdateBoxStatusUseCase } from './app/use_cases/boxes/UpdateBoxStatusUseCase';
import { UpdateBoxUseCase } from './app/use_cases/boxes/UpdateBoxUseCase';
import { DeleteBoxUseCase } from './app/use_cases/boxes/DeleteBoxUseCase';
import { GetBoxForAdminEditUseCase } from './app/use_cases/boxes/GetBoxForAdminEditUseCase';

// Services
import { BoxProductResolutionService } from './infra/services/box/BoxProductResolutionService';
import { BoxProductLinesValidator } from './infra/services/box/BoxProductLinesValidator';
import { TextileVariantPickerMediaService } from './infra/services/box/TextileVariantPickerMediaService';

// Controller
import { BoxController } from './infra/controllers/box/box.controller';

// Dependent modules
import { BoxSealModule } from './boxSeal.module';
import { SuperfoodModule } from './superfood.module';
import { TextileProductModule } from './textileProduct.module';
import { VariantModule } from './variant.module';
import { MediaItemModule } from './mediaItem.module';
import { CommunityModule } from './community.module';
import { ShopsModule } from './shop.module';
import { ProviderInfoModule } from './providerInfo.module';
import { OwnerInfoResolver } from './infra/services/owner/OwnerInfoResolver';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Box', schema: BoxSchema }]),
		BoxSealModule,
		SuperfoodModule,
		TextileProductModule,
		VariantModule,
		MediaItemModule,
		CommunityModule,
		ShopsModule,
		ProviderInfoModule,
	],
	controllers: [BoxController],
	providers: [
		// Repository
		{
			provide: BoxRepository,
			useClass: BoxRepoImpl,
		},
		// Services
		BoxProductResolutionService,
		BoxProductLinesValidator,
		TextileVariantPickerMediaService,
		OwnerInfoResolver,
		// Use Cases
		CreateBoxUseCase,
		GetAllBoxesUseCase,
		GetBoxDetailUseCase,
		GetBoxCatalogSuperfoodsUseCase,
		GetBoxCatalogTextileProductsUseCase,
		GetBoxCatalogTextileVariantsUseCase,
		GetBoxCatalogSuperfoodVariantsUseCase,
		GetBoxCatalogTextileProductMediaUseCase,
		GetBoxCatalogSuperfoodProductMediaUseCase,
		UpdateBoxStatusUseCase,
		UpdateBoxUseCase,
		DeleteBoxUseCase,
		GetBoxForAdminEditUseCase,
	],
	exports: [BoxRepository, MongooseModule],
})
export class BoxModule {}
