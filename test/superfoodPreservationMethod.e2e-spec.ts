import { createSuperfoodSubResourceTests } from './helpers/superfood-subresource-test.factory';
import { SuperfoodPreservationMethodController } from '../src/andean/infra/controllers/superfoodControllers/superfoodPreservationMethod.controller';
import { CreateSuperfoodPreservationMethodUseCase } from '../src/andean/app/use_cases/superfoods/preservationMethod/CreateSuperfoodPreservationMethodUseCase';
import { GetSuperfoodPreservationMethodByIdUseCase } from '../src/andean/app/use_cases/superfoods/preservationMethod/GetSuperfoodPreservationMethodByIdUseCase';
import { ListSuperfoodPreservationMethodsUseCase } from '../src/andean/app/use_cases/superfoods/preservationMethod/ListSuperfoodPreservationMethodsUseCase';
import { DeleteSuperfoodPreservationMethodUseCase } from '../src/andean/app/use_cases/superfoods/preservationMethod/DeleteSuperfoodPreservationMethodUseCase';

createSuperfoodSubResourceTests({
	name: 'SuperfoodPreservationMethod',
	endpoint: '/superfood-preservation-methods',
	fixtureName: 'superfood-preservation-method.fixture.json',
	controller: SuperfoodPreservationMethodController,
	useCases: {
		create: CreateSuperfoodPreservationMethodUseCase,
		getById: GetSuperfoodPreservationMethodByIdUseCase,
		list: ListSuperfoodPreservationMethodsUseCase,
		delete: DeleteSuperfoodPreservationMethodUseCase,
	},
});
