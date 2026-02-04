import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { MediaItemSchema } from './infra/persistence/mediaItem.schema';

// Repository
import { MediaItemRepository } from './app/datastore/MediaItem.repo';
import { MediaItemRepoImpl } from './infra/datastore/mediaItem.repo.impl';

// Services
import { S3StorageService } from './infra/services/S3StorageService';

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
		// Repository
		{
			provide: MediaItemRepository,
			useClass: MediaItemRepoImpl,
		},

		// Services
		S3StorageService,

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
