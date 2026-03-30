import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { MediaItemSchema } from './infra/persistence/mediaItem.schema';

// Repositories
import { MediaItemRepository } from './app/datastore/MediaItem.repo';
import { MediaItemRepoImpl } from './infra/datastore/mediaItem.repo.impl';
import { StorageRepository } from './app/datastore/Storage.repo';
import { ImageOptimizerRepository } from './app/datastore/ImageOptimizer.repo';
import { S3StorageRepoImpl } from './infra/datastore/S3Storage.repo.impl';
import {
	ImageOptimizerRepoImpl,
	OptimizedStorageRepoImpl,
} from './infra/datastore/OptimizedStorage.repo.impl';

// Use Cases
import { UploadMediaItemUseCase } from './app/use_cases/media/UploadMediaItemUseCase';
import { UpdateMediaItemUseCase } from './app/use_cases/media/UpdateMediaItemUseCase';
import { GetMediaItemByIdUseCase } from './app/use_cases/media/GetMediaItemByIdUseCase';
import { ListMediaItemsUseCase } from './app/use_cases/media/ListMediaItemsUseCase';
import { DeleteMediaItemUseCase } from './app/use_cases/media/DeleteMediaItemUseCase';
import { MediaUrlResolver } from './infra/services/textileProducts/MediaUrlResolver';

// Controller
import { MediaItemController } from './infra/controllers/mediaItem.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'MediaItem', schema: MediaItemSchema }]),
	],
	controllers: [MediaItemController],
	providers: [
		// Repositories
		{
			provide: MediaItemRepository,
			useClass: MediaItemRepoImpl,
		},
		S3StorageRepoImpl,
		{
			provide: ImageOptimizerRepository,
			useClass: ImageOptimizerRepoImpl,
		},
		{
			provide: StorageRepository,
			useFactory: (
				s3: S3StorageRepoImpl,
				optimizer: ImageOptimizerRepository,
			) => new OptimizedStorageRepoImpl(s3, optimizer),
			inject: [S3StorageRepoImpl, ImageOptimizerRepository],
		},

		// Use Cases
		UploadMediaItemUseCase,
		UpdateMediaItemUseCase,
		GetMediaItemByIdUseCase,
		ListMediaItemsUseCase,
		DeleteMediaItemUseCase,
		MediaUrlResolver,
	],
	exports: [
		MediaItemRepository,
		StorageRepository,
		MongooseModule,
		MediaUrlResolver,
	],
})
export class MediaItemModule {}
