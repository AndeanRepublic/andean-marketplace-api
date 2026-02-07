import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

// Schema
import { CommunitySchema } from './infra/persistence/community/community.schema';
import { SealSchema } from './infra/persistence/community/Seal.schema';

// Repository
import { CommunityRepository } from './app/datastore/community/community.repo';
import { CommunityRepositoryImpl } from './infra/datastore/community/community.repo.impl';
import { SealRepository } from './app/datastore/community/Seal.repo';
import { SealRepositoryImpl } from './infra/datastore/community/Seal.repo.impl';

// Use Cases
import { CreateCommunityUseCase } from './app/use_cases/community/CreateCommunityUseCase';
import { UpdateCommunityUseCase } from './app/use_cases/community/UpdateCommunityUseCase';
import { GetCommunityByIdUseCase } from './app/use_cases/community/GetCommunityByIdUseCase';
import { ListCommunityUseCase } from './app/use_cases/community/ListCommunityUseCase';
import { DeleteCommunityUseCase } from './app/use_cases/community/DeleteCommunityUseCase';
import { CreateSealUseCase } from './app/use_cases/community/CreateSealUseCase';
import { GetAllSealsUseCase } from './app/use_cases/community/GetAllSealsUseCase';
import { GetByIdSealUseCase } from './app/use_cases/community/GetByIdSealUseCase';
import { UpdateSealUseCase } from './app/use_cases/community/UpdateSealUseCase';
import { DeleteSealUseCase } from './app/use_cases/community/DeleteSealUseCase';

// Modules
import { MediaItemModule } from './mediaItem.module';

// Controller
import { CommunityController } from './infra/controllers/community.controller';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Community', schema: CommunitySchema },
			{ name: 'Seal', schema: SealSchema },
		]),
		MediaItemModule,
	],
	controllers: [CommunityController],
	providers: [
		// Repository
		{
			provide: CommunityRepository,
			useClass: CommunityRepositoryImpl,
		},
		{
			provide: SealRepository,
			useClass: SealRepositoryImpl,
		},
		// Use Cases
		CreateCommunityUseCase,
		UpdateCommunityUseCase,
		GetCommunityByIdUseCase,
		ListCommunityUseCase,
		DeleteCommunityUseCase,
		CreateSealUseCase,
		GetAllSealsUseCase,
		GetByIdSealUseCase,
		UpdateSealUseCase,
		DeleteSealUseCase,
	],
	exports: [CommunityRepository, SealRepository],
})
export class CommunityModule implements OnModuleInit {
	constructor(@InjectConnection() private readonly connection: Connection) { }

	async onModuleInit() {
		try {
			// Eliminar el índice viejo 'id_1' si existe
			const collection = this.connection.collection('communities');
			const indexes = await collection.indexes();

			const hasOldIdIndex = indexes.some((index) => index.name === 'id_1');

			if (hasOldIdIndex) {
				await collection.dropIndex('id_1');
				console.log('✅ Índice viejo "id_1" eliminado de communities');
			}
		} catch (error: any) {
			// Si el índice no existe, ignorar el error
			if (error.code !== 27) {
				console.warn('⚠️ No se pudo eliminar el índice viejo:', error.message);
			}
		}
	}
}
