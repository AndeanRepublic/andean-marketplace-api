import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { MediaItemSchema } from './infra/persistence/mediaItem.schema';

// Repositories
import { MediaItemRepository } from './app/datastore/MediaItem.repo';
import { MediaItemRepoImpl } from './infra/datastore/mediaItem.repo.impl';
import { StorageRepository } from './app/datastore/Storage.repo';
import { S3StorageRepoImpl } from './infra/datastore/S3Storage.repo.impl';

// Use Cases
import { UploadMediaItemUseCase } from './app/use_cases/media/UploadMediaItemUseCase';
import { UpdateMediaItemUseCase } from './app/use_cases/media/UpdateMediaItemUseCase';
import { GetMediaItemByIdUseCase } from './app/use_cases/media/GetMediaItemByIdUseCase';
import { ListMediaItemsUseCase } from './app/use_cases/media/ListMediaItemsUseCase';
import { DeleteMediaItemUseCase } from './app/use_cases/media/DeleteMediaItemUseCase';

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
		{
			provide: StorageRepository,
			useClass: S3StorageRepoImpl,
		},

		// Use Cases
		UploadMediaItemUseCase,
		UpdateMediaItemUseCase,
		GetMediaItemByIdUseCase,
		ListMediaItemsUseCase,
		DeleteMediaItemUseCase,
	],
	exports: [MediaItemRepository, MongooseModule],
})
export class MediaItemModule { }
