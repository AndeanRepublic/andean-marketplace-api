import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileTypeUseCase';
import { TextileTypeRepository } from 'src/andean/app/datastore/textileProducts/TextileType.repo';
import { CreateTextileTypeDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileTypeDto';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';

// describe agrupa los tests relacionados con el use case
describe('CreateTextileTypeUseCase', () => {
	let useCase: CreateTextileTypeUseCase;
	let mockRepo: {
		getTextileTypeByName: jest.Mock;
		saveTextileType: jest.Mock;
	}; // declaro el mock para simular el repo

	const createDto: CreateTextileTypeDto = { name: 'Lana de Alpaca' };
	const existingType: TextileType = new TextileType(
		'existing-id',
		'Lana de Alpaca',
	); // tipo que ya existe cuando usemos el mock para simular el repo
	const savedType: TextileType = new TextileType(
		'saved-id-123',
		'Lana de Alpaca',
	); // tipo que se guarda cuando usemos el mock para simular el repo

	// preparar el test, dejar todo listo para el test
	beforeEach(async () => {
		// asignacion de valores al mock
		mockRepo = {
			getTextileTypeByName: jest.fn(),
			saveTextileType: jest.fn().mockResolvedValue(savedType),
		};

		// creacion del modulo de testing
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateTextileTypeUseCase,
				// asignacion del mock al repo
				{ provide: TextileTypeRepository, useValue: mockRepo },
			],
		}).compile();

		// obtener la instancia construida del use case
		useCase = module.get(CreateTextileTypeUseCase);
	});

	// crear test
	it('creates type when name does not exist', async () => {
		// al llamar a getTextileTypeByName, devolvemos null
		mockRepo.getTextileTypeByName.mockResolvedValue(null);

		// corremos el use case y obtenemos el resultado
		const result = await useCase.handle(createDto);

		// COMPARACIONES DE RESULTADOS
		expect(result).toEqual(savedType); // el resultado tiene que ser lo esperado
		expect(mockRepo.getTextileTypeByName).toHaveBeenCalledWith(
			'Lana de Alpaca',
		); // el metodo getTextileTypeByName se ha llamado con el nombre del tipo
		expect(mockRepo.saveTextileType).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'Lana de Alpaca' }),
		); // el metodo saveTextileType se ha llamado con un objeto que contiene el nombre del tipo
	});

	it('throws BadRequestException when name already exists', async () => {
		mockRepo.getTextileTypeByName.mockResolvedValue(existingType);

		await expect(useCase.handle(createDto)).rejects.toThrow(
			new BadRequestException('Type already exists'),
		); // el metodo al llamarse lanza un bad request exception

		expect(mockRepo.saveTextileType).not.toHaveBeenCalled(); // el metodo saveTextileType no se ha llamado
	});
});
