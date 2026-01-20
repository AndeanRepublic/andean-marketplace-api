import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

// Schema
import { CommunitySchema } from './infra/persistence/community.schema';

// Repository
import { CommunityRepository } from './app/datastore/community.repo';
import { CommunityRepositoryImpl } from './infra/datastore/community.repo.impl';

// Use Cases
import { CreateCommunityUseCase } from './app/use_cases/community/CreateCommunityUseCase';
import { UpdateCommunityUseCase } from './app/use_cases/community/UpdateCommunityUseCase';
import { GetCommunityByIdUseCase } from './app/use_cases/community/GetCommunityByIdUseCase';
import { ListCommunityUseCase } from './app/use_cases/community/ListCommunityUseCase';
import { DeleteCommunityUseCase } from './app/use_cases/community/DeleteCommunityUseCase';

// Controller
import { CommunityController } from './infra/controllers/community.controller';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Community', schema: CommunitySchema },
		]),
	],
	controllers: [CommunityController],
	providers: [
		// Repository
		{
			provide: CommunityRepository,
			useClass: CommunityRepositoryImpl,
		},

		// Use Cases
		CreateCommunityUseCase,
		UpdateCommunityUseCase,
		GetCommunityByIdUseCase,
		ListCommunityUseCase,
		DeleteCommunityUseCase,
	],
	exports: [CommunityRepository],
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
		} catch (error) {
			// Si el índice no existe, ignorar el error
			if (error.code !== 27) {
				console.warn('⚠️ No se pudo eliminar el índice viejo:', error.message);
			}
		}
	}
}
