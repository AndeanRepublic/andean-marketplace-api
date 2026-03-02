import { createSuperfoodSubResourceTests } from './helpers/superfood-subresource-test.factory';
import { SuperfoodCertificationController } from '../src/andean/infra/controllers/superfoodControllers/superfoodCertification.controller';
import { CreateSuperfoodCertificationUseCase } from '../src/andean/app/use_cases/superfoods/certification/CreateSuperfoodCertificationUseCase';
import { GetSuperfoodCertificationByIdUseCase } from '../src/andean/app/use_cases/superfoods/certification/GetSuperfoodCertificationByIdUseCase';
import { ListSuperfoodCertificationsUseCase } from '../src/andean/app/use_cases/superfoods/certification/ListSuperfoodCertificationsUseCase';
import { DeleteSuperfoodCertificationUseCase } from '../src/andean/app/use_cases/superfoods/certification/DeleteSuperfoodCertificationUseCase';

createSuperfoodSubResourceTests({
	name: 'SuperfoodCertification',
	endpoint: '/superfood-certifications',
	fixtureName: 'superfood-certification.fixture.json',
	controller: SuperfoodCertificationController,
	useCases: {
		create: CreateSuperfoodCertificationUseCase,
		getById: GetSuperfoodCertificationByIdUseCase,
		list: ListSuperfoodCertificationsUseCase,
		delete: DeleteSuperfoodCertificationUseCase,
	},
});
