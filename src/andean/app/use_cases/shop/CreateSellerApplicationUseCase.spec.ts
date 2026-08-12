import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateSellerApplicationUseCase } from './CreateSellerApplicationUseCase';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { AccountRepository } from '../../datastore/Account.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { CreateSellerUseCase } from '../users/CreateSellerUseCase';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { CreateProviderInfoUseCase } from '../providerInfo/CreateProviderInfoUseCase';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { SellerStatus } from '../../../domain/enums/SellerStatus';
import { ShopStatus } from '../../../domain/enums/ShopStatus';
import { PersonType } from '../../../domain/enums/PersonType';
import { ShopCategory } from '../../../domain/enums/ShopCategory';

describe('CreateSellerApplicationUseCase', () => {
	let useCase: CreateSellerApplicationUseCase;
	let accountRepository: jest.Mocked<AccountRepository>;
	let sellerRepository: jest.Mocked<SellerProfileRepository>;
	let shopRepository: jest.Mocked<ShopRepository>;
	let createSellerUseCase: jest.Mocked<CreateSellerUseCase>;

	const userId = '507f1f77bcf86cd799439011';
	const sellerProfileId = '507f1f77bcf86cd799439012';

	const applicationDto = {
		seller: {
			typePerson: PersonType.NATURAL,
			numberDocument: '12345678',
			name: 'María García',
			address: 'Cusco',
			phoneNumber: '+51987654321',
		},
		name: 'Tienda Andina',
		categories: [ShopCategory.TEXTILES],
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateSellerApplicationUseCase,
				{
					provide: ShopRepository,
					useValue: {
						getAllBySellerId: jest.fn(),
						saveShop: jest.fn(),
						updateShop: jest.fn(),
					},
				},
				{
					provide: AccountRepository,
					useValue: { getAccountById: jest.fn() },
				},
				{
					provide: SellerProfileRepository,
					useValue: { getSellerByUserId: jest.fn() },
				},
				{
					provide: CreateSellerUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: SealRepository,
					useValue: { getById: jest.fn() },
				},
				{
					provide: CreateProviderInfoUseCase,
					useValue: { handle: jest.fn() },
				},
			],
		}).compile();

		useCase = module.get(CreateSellerApplicationUseCase);
		accountRepository = module.get(AccountRepository);
		sellerRepository = module.get(SellerProfileRepository);
		shopRepository = module.get(ShopRepository);
		createSellerUseCase = module.get(CreateSellerUseCase);
	});

	it('should reject users who already have the SELLER role', async () => {
		accountRepository.getAccountById.mockResolvedValue({
			id: userId,
			name: 'María',
			email: 'maria@test.com',
			password: 'hash',
			status: AccountStatus.ENABLED,
			roles: [AccountRole.USER, AccountRole.SELLER],
			passwordVersion: 1,
		});

		await expect(useCase.handle(userId, applicationDto)).rejects.toThrow(
			ConflictException,
		);
		await expect(useCase.handle(userId, applicationDto)).rejects.toThrow(
			'Ya eres vendedor registrado. No puedes enviar una nueva solicitud.',
		);
		expect(createSellerUseCase.handle).not.toHaveBeenCalled();
	});

	it('should reject users with an approved seller profile', async () => {
		accountRepository.getAccountById.mockResolvedValue({
			id: userId,
			name: 'María',
			email: 'maria@test.com',
			password: 'hash',
			status: AccountStatus.ENABLED,
			roles: [AccountRole.USER],
			passwordVersion: 1,
		});
		sellerRepository.getSellerByUserId.mockResolvedValue({
			id: sellerProfileId,
			userId,
			name: 'María',
			typePerson: PersonType.NATURAL,
			numberDocument: '12345678',
			ruc: '',
			address: 'Cusco',
			phoneNumber: '+51987654321',
			status: SellerStatus.APPROVED,
		});

		await expect(useCase.handle(userId, applicationDto)).rejects.toThrow(
			'Ya existe una solicitud o perfil de vendedor activo',
		);
	});

	it('should reject users with an assigned active shop', async () => {
		accountRepository.getAccountById.mockResolvedValue({
			id: userId,
			name: 'María',
			email: 'maria@test.com',
			password: 'hash',
			status: AccountStatus.ENABLED,
			roles: [AccountRole.USER],
			passwordVersion: 1,
		});
		sellerRepository.getSellerByUserId.mockResolvedValue({
			id: sellerProfileId,
			userId,
			name: 'María',
			typePerson: PersonType.NATURAL,
			numberDocument: '12345678',
			ruc: '',
			address: 'Cusco',
			phoneNumber: '+51987654321',
			status: SellerStatus.REJECTED,
		});
		shopRepository.getAllBySellerId.mockResolvedValue([
			{
				id: '507f1f77bcf86cd799439013',
				sellerId: sellerProfileId,
				name: 'Tienda previa',
				status: ShopStatus.ACTIVE,
				categories: [ShopCategory.TEXTILES],
			},
		]);

		await expect(useCase.handle(userId, applicationDto)).rejects.toThrow(
			'Ya tienes una tienda asignada o pendiente de revisión',
		);
	});
});
