import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TextileProductModule } from './textileProduct.module';
import { ShopsModule } from './shop.module';
import { UsersModule } from './users.module';
import { SellerResourceAccessModule } from './sellerResourceAccess.module';

// Schema
import { VariantSchema } from './infra/persistence/variant.schema';

// Repository
import { VariantRepository } from './app/datastore/Variant.repo';
import { VariantRepositoryImpl } from './infra/datastore/variant.repo.impl';

// Use Cases
import { CreateVariantUseCase } from './app/use_cases/variant/CreateVariantUseCase';
import { CreateManyVariantsUseCase } from './app/use_cases/variant/CreateManyVariantsUseCase';
import { GetVariantByIdUseCase } from './app/use_cases/variant/GetVariantByIdUseCase';
import { GetAllVariantsUseCase } from './app/use_cases/variant/GetAllVariantsUseCase';
import { GetVariantsByProductIdUseCase } from './app/use_cases/variant/GetVariantsByProductIdUseCase';
import { UpdateVariantUseCase } from './app/use_cases/variant/UpdateVariantUseCase';
import { DeleteVariantUseCase } from './app/use_cases/variant/DeleteVariantUseCase';
import { DeleteVariantsByProductIdUseCase } from './app/use_cases/variant/DeleteVariantsByProductIdUseCase';
import { SyncVariantsUseCase } from './app/use_cases/variant/SyncVariantsUseCase';
// Controller
import { VariantController } from './infra/controllers/variantControllers/variant.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Variant', schema: VariantSchema }]),
		forwardRef(() => TextileProductModule),
		ShopsModule,
		UsersModule,
		SellerResourceAccessModule,
	],
	controllers: [VariantController],
	providers: [
		// Repository
		{
			provide: VariantRepository,
			useClass: VariantRepositoryImpl,
		},

		// Use Cases
		CreateVariantUseCase,
		CreateManyVariantsUseCase,
		GetVariantByIdUseCase,
		GetAllVariantsUseCase,
		GetVariantsByProductIdUseCase,
		UpdateVariantUseCase,
		DeleteVariantUseCase,
		DeleteVariantsByProductIdUseCase,
		SyncVariantsUseCase,
	],
	exports: [
		VariantRepository,
		CreateVariantUseCase,
		CreateManyVariantsUseCase,
		GetVariantByIdUseCase,
		GetAllVariantsUseCase,
		GetVariantsByProductIdUseCase,
		UpdateVariantUseCase,
		DeleteVariantUseCase,
		DeleteVariantsByProductIdUseCase,
		SyncVariantsUseCase,
	],
})
export class VariantModule {}
