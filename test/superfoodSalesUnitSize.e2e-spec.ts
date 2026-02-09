import { createSuperfoodSubResourceTests } from './helpers/superfood-subresource-test.factory';
import { SuperfoodSalesUnitSizeController } from '../src/andean/infra/controllers/superfoodControllers/superfoodSalesUnitSize.controller';
import { CreateSuperfoodSalesUnitSizeUseCase } from '../src/andean/app/use_cases/superfoods/salesUnitSize/CreateSuperfoodSalesUnitSizeUseCase';
import { GetSuperfoodSalesUnitSizeByIdUseCase } from '../src/andean/app/use_cases/superfoods/salesUnitSize/GetSuperfoodSalesUnitSizeByIdUseCase';
import { ListSuperfoodSalesUnitSizesUseCase } from '../src/andean/app/use_cases/superfoods/salesUnitSize/ListSuperfoodSalesUnitSizesUseCase';
import { DeleteSuperfoodSalesUnitSizeUseCase } from '../src/andean/app/use_cases/superfoods/salesUnitSize/DeleteSuperfoodSalesUnitSizeUseCase';

createSuperfoodSubResourceTests({
	name: 'SuperfoodSalesUnitSize',
	endpoint: '/superfood-sales-unit-sizes',
	fixtureName: 'superfood-sales-unit-size.fixture.json',
	controller: SuperfoodSalesUnitSizeController,
	useCases: {
		create: CreateSuperfoodSalesUnitSizeUseCase,
		getById: GetSuperfoodSalesUnitSizeByIdUseCase,
		list: ListSuperfoodSalesUnitSizesUseCase,
		delete: DeleteSuperfoodSalesUnitSizeUseCase,
	},
	hasAlreadyExistsTest: true,
	hasNotStringTest: true,
	hasMultipleItemsTest: true,
});
