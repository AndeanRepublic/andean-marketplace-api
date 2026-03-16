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

// Services
import { BoxProductResolutionService } from './infra/services/box/BoxProductResolutionService';

// Controller
import { BoxController } from './infra/controllers/box/box.controller';

// Dependent modules
import { BoxSealModule } from './boxSeal.module';
import { SuperfoodModule } from './superfood.module';
import { TextileProductModule } from './textileProduct.module';
import { VariantModule } from './variant.module';
import { MediaItemModule } from './mediaItem.module';
import { CommunityModule } from './community.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Box', schema: BoxSchema }]),
		BoxSealModule,
		SuperfoodModule,
		TextileProductModule,
		VariantModule,
		MediaItemModule,
		CommunityModule,
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
		// Use Cases
		CreateBoxUseCase,
		GetAllBoxesUseCase,
		GetBoxDetailUseCase,
	],
	exports: [BoxRepository, MongooseModule],
})
export class BoxModule {}
