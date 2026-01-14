import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { ProductTraceabilitySchema } from './infra/persistence/productTraceability.schema';

// Repository
import { ProductTraceabilityRepository } from './app/datastore/productTraceability.repo';
import { ProductTraceabilityRepositoryImpl } from './infra/datastore/productTraceability.repo.impl';

// Use Cases
import { CreateProductTraceabilityUseCase } from './app/use_cases/traceability/CreateProductTraceabilityUseCase';
import { UpdateProductTraceabilityUseCase } from './app/use_cases/traceability/UpdateProductTraceabilityUseCase';
import { GetProductTraceabilityByIdUseCase } from './app/use_cases/traceability/GetProductTraceabilityByIdUseCase';
import { GetProductTraceabilityByProductIdUseCase } from './app/use_cases/traceability/GetProductTraceabilityByProductIdUseCase';
import { ListProductTraceabilityUseCase } from './app/use_cases/traceability/ListProductTraceabilityUseCase';
import { DeleteProductTraceabilityUseCase } from './app/use_cases/traceability/DeleteProductTraceabilityUseCase';

// Controller
import { ProductTraceabilityController } from './infra/controllers/productTraceability.controller';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'ProductTraceability', schema: ProductTraceabilitySchema },
		]),
	],
	controllers: [ProductTraceabilityController],
	providers: [
		// Repository
		{
			provide: ProductTraceabilityRepository,
			useClass: ProductTraceabilityRepositoryImpl,
		},

		// Use Cases
		CreateProductTraceabilityUseCase,
		UpdateProductTraceabilityUseCase,
		GetProductTraceabilityByIdUseCase,
		GetProductTraceabilityByProductIdUseCase,
		ListProductTraceabilityUseCase,
		DeleteProductTraceabilityUseCase,
	],
	exports: [ProductTraceabilityRepository],
})
export class ProductTraceabilityModule { }
