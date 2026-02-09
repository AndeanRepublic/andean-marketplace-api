import { createSuperfoodSubResourceTests } from './helpers/superfood-subresource-test.factory';
import { SuperfoodBenefitController } from '../src/andean/infra/controllers/superfoodControllers/superfoodBenefit.controller';
import { CreateSuperfoodBenefitUseCase } from '../src/andean/app/use_cases/superfoods/benefit/CreateSuperfoodBenefitUseCase';
import { GetSuperfoodBenefitByIdUseCase } from '../src/andean/app/use_cases/superfoods/benefit/GetSuperfoodBenefitByIdUseCase';
import { ListSuperfoodBenefitsUseCase } from '../src/andean/app/use_cases/superfoods/benefit/ListSuperfoodBenefitsUseCase';
import { DeleteSuperfoodBenefitUseCase } from '../src/andean/app/use_cases/superfoods/benefit/DeleteSuperfoodBenefitUseCase';

createSuperfoodSubResourceTests({
	name: 'SuperfoodBenefit',
	endpoint: '/superfood-benefits',
	fixtureName: 'superfood-benefit.fixture.json',
	controller: SuperfoodBenefitController,
	useCases: {
		create: CreateSuperfoodBenefitUseCase,
		getById: GetSuperfoodBenefitByIdUseCase,
		list: ListSuperfoodBenefitsUseCase,
		delete: DeleteSuperfoodBenefitUseCase,
	},
});
