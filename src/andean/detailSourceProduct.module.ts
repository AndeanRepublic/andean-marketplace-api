import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DetailSourceProductSchema } from './infra/persistence/superfood/detailSourceProduct.schema';
import { DetailSourceProductRepoImpl } from './infra/datastore/detailSourceProduct.repo.impl';
import { DetailSourceProductRepository } from './app/datastore/DetailSourceProduct.repo';
import { CreateDetailSourceProductUseCase } from './app/use_cases/detailSourceProduct/CreateDetailSourceProductUseCase';
import { GetDetailSourceProductByIdUseCase } from './app/use_cases/detailSourceProduct/GetDetailSourceProductByIdUseCase';
import { GetAllDetailSourceProductsUseCase } from './app/use_cases/detailSourceProduct/GetAllDetailSourceProductsUseCase';
import { UpdateDetailSourceProductUseCase } from './app/use_cases/detailSourceProduct/UpdateDetailSourceProductUseCase';
import { DeleteDetailSourceProductUseCase } from './app/use_cases/detailSourceProduct/DeleteDetailSourceProductUseCase';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'DetailSourceProduct', schema: DetailSourceProductSchema },
		]),
	],
	controllers: [], // No controller, se maneja desde SuperfoodModule
	providers: [
		{
			provide: DetailSourceProductRepository,
			useClass: DetailSourceProductRepoImpl,
		},
		CreateDetailSourceProductUseCase,
		GetDetailSourceProductByIdUseCase,
		GetAllDetailSourceProductsUseCase,
		UpdateDetailSourceProductUseCase,
		DeleteDetailSourceProductUseCase,
	],
	exports: [
		DetailSourceProductRepository,
		CreateDetailSourceProductUseCase,
		GetDetailSourceProductByIdUseCase,
		GetAllDetailSourceProductsUseCase,
		UpdateDetailSourceProductUseCase,
		DeleteDetailSourceProductUseCase,
	],
})
export class DetailSourceProductModule { }
