import { Injectable } from '@nestjs/common';
import { TextileCraftTechniqueRepository } from '../../../app/datastore/textileProducts/TextileCraftTechnique.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileCraftTechniqueDocument } from '../../persistence/textileProducts/textileCraftTechnique.schema';
import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';
import { TextileCraftTechniqueMapper } from '../../services/textileProducts/TextileCraftTechniqueMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class TextileCraftTechniqueRepositoryImpl extends TextileCraftTechniqueRepository {
	constructor(
		@InjectModel('TextileCraftTechnique')
		private readonly textileCraftTechniqueModel: Model<TextileCraftTechniqueDocument>,
	) {
		super();
	}

	async getAllTextileCraftTechniques(): Promise<TextileCraftTechnique[]> {
		const docs = await this.textileCraftTechniqueModel.find().exec();
		return docs.map((doc) => TextileCraftTechniqueMapper.fromDocument(doc));
	}

	async getTextileCraftTechniqueById(
		id: string,
	): Promise<TextileCraftTechnique | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.textileCraftTechniqueModel.findById(objectId).exec();
		return doc ? TextileCraftTechniqueMapper.fromDocument(doc) : null;
	}

	async saveTextileCraftTechnique(
		technique: TextileCraftTechnique,
	): Promise<TextileCraftTechnique> {
		const plain = TextileCraftTechniqueMapper.toPersistence(technique);
		const created = new this.textileCraftTechniqueModel(plain);
		const savedTechnique = await created.save();
		return TextileCraftTechniqueMapper.fromDocument(savedTechnique);
	}

	async updateTextileCraftTechnique(
		id: string,
		technique: TextileCraftTechnique,
	): Promise<TextileCraftTechnique> {
		const plain = TextileCraftTechniqueMapper.toPersistence(technique);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.textileCraftTechniqueModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return TextileCraftTechniqueMapper.fromDocument(updated!);
	}

	async deleteTextileCraftTechnique(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.textileCraftTechniqueModel.findByIdAndDelete(objectId).exec();
		return;
	}
}
