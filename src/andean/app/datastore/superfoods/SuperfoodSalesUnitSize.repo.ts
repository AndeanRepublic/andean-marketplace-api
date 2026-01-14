import { SuperfoodSalesUnitSize } from '../../../domain/entities/superfoods/SuperfoodSalesUnitSize';

export abstract class SuperfoodSalesUnitSizeRepository {
	abstract getById(id: string): Promise<SuperfoodSalesUnitSize | null>;

	abstract getAll(): Promise<SuperfoodSalesUnitSize[]>;

	abstract save(unitSize: SuperfoodSalesUnitSize): Promise<SuperfoodSalesUnitSize>;

	abstract update(unitSize: SuperfoodSalesUnitSize): Promise<SuperfoodSalesUnitSize>;

	abstract delete(id: string): Promise<void>;
}
