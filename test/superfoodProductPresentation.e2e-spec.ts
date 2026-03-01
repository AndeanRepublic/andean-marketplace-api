import { createSuperfoodSubResourceTests } from './helpers/superfood-subresource-test.factory';
import { SuperfoodProductPresentationController } from '../src/andean/infra/controllers/superfoodControllers/superfoodProductPresentation.controller';
import { CreateSuperfoodProductPresentationUseCase } from '../src/andean/app/use_cases/superfoods/productPresentation/CreateSuperfoodProductPresentationUseCase';
import { GetSuperfoodProductPresentationByIdUseCase } from '../src/andean/app/use_cases/superfoods/productPresentation/GetSuperfoodProductPresentationByIdUseCase';
import { ListSuperfoodProductPresentationsUseCase } from '../src/andean/app/use_cases/superfoods/productPresentation/ListSuperfoodProductPresentationsUseCase';
import { DeleteSuperfoodProductPresentationUseCase } from '../src/andean/app/use_cases/superfoods/productPresentation/DeleteSuperfoodProductPresentationUseCase';

createSuperfoodSubResourceTests({
	name: 'SuperfoodProductPresentation',
	endpoint: '/superfood-product-presentations',
	fixtureName: 'superfood-product-presentation.fixture.json',
	controller: SuperfoodProductPresentationController,
	useCases: {
		create: CreateSuperfoodProductPresentationUseCase,
		getById: GetSuperfoodProductPresentationByIdUseCase,
		list: ListSuperfoodProductPresentationsUseCase,
		delete: DeleteSuperfoodProductPresentationUseCase,
	},
	hasAlreadyExistsTest: true,
	hasNotStringTest: true,
	hasMultipleItemsTest: true,
});
