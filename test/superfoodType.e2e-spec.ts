import { createSuperfoodSubResourceTests } from './helpers/superfood-subresource-test.factory';
import { SuperfoodTypeController } from '../src/andean/infra/controllers/superfoodControllers/superfoodType.controller';
import { CreateSuperfoodTypeUseCase } from '../src/andean/app/use_cases/superfoods/type/CreateSuperfoodTypeUseCase';
import { CreateManySuperfoodTypesUseCase } from '../src/andean/app/use_cases/superfoods/type/CreateManySuperfoodTypesUseCase';
import { GetSuperfoodTypeByIdUseCase } from '../src/andean/app/use_cases/superfoods/type/GetSuperfoodTypeByIdUseCase';
import { ListSuperfoodTypesUseCase } from '../src/andean/app/use_cases/superfoods/type/ListSuperfoodTypesUseCase';
import { DeleteSuperfoodTypeUseCase } from '../src/andean/app/use_cases/superfoods/type/DeleteSuperfoodTypeUseCase';

createSuperfoodSubResourceTests({
	name: 'SuperfoodType',
	endpoint: '/superfood-types',
	fixtureName: 'superfood-type.fixture.json',
	controller: SuperfoodTypeController,
	useCases: {
		create: CreateSuperfoodTypeUseCase,
		createMany: CreateManySuperfoodTypesUseCase,
		getById: GetSuperfoodTypeByIdUseCase,
		list: ListSuperfoodTypesUseCase,
		delete: DeleteSuperfoodTypeUseCase,
	},
	hasAlreadyExistsTest: true,
	hasNotStringTest: true,
	hasMultipleItemsTest: true,
});
