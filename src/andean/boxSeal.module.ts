import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { BoxSealSchema } from './infra/persistence/box/boxSeal.schema';

// Repository
import { BoxSealRepository } from './app/datastore/box/BoxSeal.repo';
import { BoxSealRepoImpl } from './infra/datastore/box/boxSeal.repo.impl';

// Use Cases
import { CreateBoxSealUseCase } from './app/use_cases/boxSeals/CreateBoxSealUseCase';
import { GetAllBoxSealsUseCase } from './app/use_cases/boxSeals/GetAllBoxSealsUseCase';
import { GetBoxSealByIdUseCase } from './app/use_cases/boxSeals/GetBoxSealByIdUseCase';
import { UpdateBoxSealUseCase } from './app/use_cases/boxSeals/UpdateBoxSealUseCase';
import { DeleteBoxSealUseCase } from './app/use_cases/boxSeals/DeleteBoxSealUseCase';

// Controller
import { BoxSealController } from './infra/controllers/boxSeal.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'BoxSeal', schema: BoxSealSchema }]),
	],
	controllers: [BoxSealController],
	providers: [
		// Repository
		{
			provide: BoxSealRepository,
			useClass: BoxSealRepoImpl,
		},
		// Use Cases
		CreateBoxSealUseCase,
		GetAllBoxSealsUseCase,
		GetBoxSealByIdUseCase,
		UpdateBoxSealUseCase,
		DeleteBoxSealUseCase,
	],
	exports: [BoxSealRepository, MongooseModule],
})
export class BoxSealModule { }
