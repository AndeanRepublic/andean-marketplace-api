import { Module } from '@nestjs/common';

// Repositories
import { SegmindRepository } from './app/datastore/Segmind.repo';
import { SegmindRepoImpl } from './infra/datastore/Segmind.repo.impl';

// Use Cases
import { TryOnUseCase } from './app/use_cases/tryOn/TryOnUseCase';

// Controller
import { TryOnController } from './infra/controllers/tryOn.controller';

// MediaItem (necesitamos MediaItemRepository para buscar la prenda)
import { MediaItemModule } from './mediaItem.module';

@Module({
	imports: [
		// Importamos MediaItemModule para acceder a MediaItemRepository
		MediaItemModule,
	],
	controllers: [TryOnController],
	providers: [
		{
			provide: SegmindRepository,
			useClass: SegmindRepoImpl,
		},
		TryOnUseCase,
	],
})
export class TryOnModule {}
