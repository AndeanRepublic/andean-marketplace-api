import { Test, TestingModule } from '@nestjs/testing';
import { CreateTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileCategoryUseCase';
import { TextileCategoryRepository } from 'src/andean/app/datastore/textileProducts/TextileCategory.repo';
import { CreateTextileCategoryDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileCategory';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { TextileCategoryStatus } from 'src/andean/domain/enums/TextileCategoryStatus';

describe('CreateTextileCategoryUseCase', () => {
	let useCase: CreateTextileCategoryUseCase;
	let mockRepo: {
		saveCategory: jest.Mock;
	};

	const createDto: CreateTextileCategoryDto = {
		name: 'Ponchos',
		status: TextileCategoryStatus.ENABLED,
	};
	const savedCategory: TextileCategory = new TextileCategory(
		'saved-id-123',
		'Ponchos',
		TextileCategoryStatus.ENABLED,
	);

	beforeEach(async () => {
		mockRepo = {
			saveCategory: jest.fn().mockResolvedValue(savedCategory),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateTextileCategoryUseCase,
				{ provide: TextileCategoryRepository, useValue: mockRepo },
			],
		}).compile();

		useCase = module.get(CreateTextileCategoryUseCase);
	});

	it('creates category with ENABLED status', async () => {
		const result = await useCase.handle(createDto);

		expect(result).toEqual(savedCategory);
		expect(mockRepo.saveCategory).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'Ponchos',
				status: TextileCategoryStatus.ENABLED,
			}),
		);
	});

	it('creates category with DISABLED status', async () => {
		const dto: CreateTextileCategoryDto = {
			name: 'Otros',
			status: TextileCategoryStatus.DISABLED,
		};
		const disabledCategory = new TextileCategory(
			'saved-id-456',
			'Otros',
			TextileCategoryStatus.DISABLED,
		);
		mockRepo.saveCategory.mockResolvedValueOnce(disabledCategory);

		const result = await useCase.handle(dto);

		expect(result).toEqual(disabledCategory);
		expect(mockRepo.saveCategory).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'Otros',
				status: TextileCategoryStatus.DISABLED,
			}),
		);
	});
});
