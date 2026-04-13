import { Module } from '@nestjs/common';

// Repositories (abstractions)
import { SegmindRepository } from './app/datastore/Segmind.repo';
import { TryOnImageOptimizerRepository } from './app/datastore/TryOnImageOptimizer.repo';

// Repositories (implementations)
import { SegmindRepoImpl } from './infra/datastore/Segmind.repo.impl';
import { TryOnImageOptimizerRepoImpl } from './infra/datastore/TryOnImageOptimizer.repo.impl';

// Use Cases
import { TryOnUseCase } from './app/use_cases/tryOn/TryOnUseCase';

// Controller
import { TryOnController } from './infra/controllers/tryOn.controller';

// MediaItem (necesitamos MediaItemRepository para buscar los media de la prenda)
import { MediaItemModule } from './mediaItem.module';

// TextileProduct (necesitamos TextileProductRepository para buscar el producto y su baseInfo)
import { TextileProductModule } from './textileProduct.module';

@Module({
	imports: [MediaItemModule, TextileProductModule],
	controllers: [TryOnController],
	providers: [
		{
			provide: SegmindRepository,
			useClass: SegmindRepoImpl,
		},
		{
			provide: TryOnImageOptimizerRepository,
			useClass: TryOnImageOptimizerRepoImpl,
		},
		TryOnUseCase,
	],
})
export class TryOnModule {}
