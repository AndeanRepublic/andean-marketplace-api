import { createSuperfoodSubResourceTests } from './helpers/superfood-subresource-test.factory';
import { SuperfoodNutritionalFeatureController } from '../src/andean/infra/controllers/superfoodControllers/superfoodNutritionalFeature.controller';
import { CreateSuperfoodNutritionalFeatureUseCase } from '../src/andean/app/use_cases/superfoods/nutritionalFeature/CreateSuperfoodNutritionalFeatureUseCase';
import { CreateManySuperfoodNutritionalFeaturesUseCase } from '../src/andean/app/use_cases/superfoods/nutritionalFeature/CreateManySuperfoodNutritionalFeaturesUseCase';
import { GetSuperfoodNutritionalFeatureByIdUseCase } from '../src/andean/app/use_cases/superfoods/nutritionalFeature/GetSuperfoodNutritionalFeatureByIdUseCase';
import { ListSuperfoodNutritionalFeaturesUseCase } from '../src/andean/app/use_cases/superfoods/nutritionalFeature/ListSuperfoodNutritionalFeaturesUseCase';
import { DeleteSuperfoodNutritionalFeatureUseCase } from '../src/andean/app/use_cases/superfoods/nutritionalFeature/DeleteSuperfoodNutritionalFeatureUseCase';

createSuperfoodSubResourceTests({
	name: 'SuperfoodNutritionalFeature',
	endpoint: '/superfood-nutritional-features',
	fixtureName: 'superfood-nutritional-feature.fixture.json',
	controller: SuperfoodNutritionalFeatureController,
	useCases: {
		create: CreateSuperfoodNutritionalFeatureUseCase,
		createMany: CreateManySuperfoodNutritionalFeaturesUseCase,
		getById: GetSuperfoodNutritionalFeatureByIdUseCase,
		list: ListSuperfoodNutritionalFeaturesUseCase,
		delete: DeleteSuperfoodNutritionalFeatureUseCase,
	},
});
