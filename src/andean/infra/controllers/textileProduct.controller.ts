import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
	Query,
	ParseIntPipe,
} from '@nestjs/common';
import { CreateTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileCategoryUseCase';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { CreateTextileCategoryDto } from './dto/textileProducts/CreateTextileCategory';
import { UpdateTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileCategoryUseCase';
import { GetAllTextileCategoriesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileCategoriesUseCase';
import { GetByIdTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileCategoryUseCase';
import { DeleteTextileCategoryUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileCategoryUseCase';
import { CreateTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileTypeUseCase';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';
import { CreateTextileTypeDto } from './dto/textileProducts/CreateTextileTypeDto';
import { UpdateTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileTypeUseCase';
import { GetAllTextileTypesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileTypesUseCase';
import { GetByIdTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileTypeUseCase';
import { DeleteTextileTypeUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileTypeUseCase';
import { CreateTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileStyleUseCase';
import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { CreateTextileStyleDto } from './dto/textileProducts/CreateTextileStyleDto';
import { UpdateTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileStyleUseCase';
import { GetAllTextileStylesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileStylesUseCase';
import { GetByIdTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileStyleUseCase';
import { DeleteTextileStyleUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileStyleUseCase';
import { CreateTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileSubcategoryUseCase';
import { TextileSubcategory } from 'src/andean/domain/entities/textileProducts/TextileSubcategory';
import { CreateTextileSubcategoryDto } from './dto/textileProducts/CreateTextileSubcategoryDto';
import { UpdateTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileSubcategoryUseCase';
import { GetAllTextileSubcategoriesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileSubcategoriesUseCase';
import { GetByIdTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileSubcategoryUseCase';
import { DeleteTextileSubcategoryUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileSubcategoryUseCase';
import { CreateTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileCraftTechniqueUseCase';
import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';
import { CreateTextileCraftTechniqueDto } from './dto/textileProducts/CreateTextileCraftTechniqueDto';
import { UpdateTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileCraftTechniqueUseCase';
import { GetAllTextileCraftTechniquesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileCraftTechniquesUseCase';
import { GetByIdTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileCraftTechniqueUseCase';
import { DeleteTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileCraftTechniqueUseCase';
import { CreateTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextilePrincipalUseUseCase';
import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';
import { CreateTextilePrincipalUseDto } from './dto/textileProducts/CreateTextilePrincipalUseDto';
import { UpdateTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextilePrincipalUseUseCase';
import { GetAllTextilePrincipalUsesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextilePrincipalUsesUseCase';
import { GetByIdTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextilePrincipalUseUseCase';
import { DeleteTextilePrincipalUseUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextilePrincipalUseUseCase';
import { CreateTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileProductUseCase';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { CreateTextileProductDto } from './dto/textileProducts/CreateTextileProductDto';
import { UpdateTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileProductUseCase';
import { GetAllTextileProductsUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileProductsUseCase';
import { GetByIdTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileProductUseCase';
import { DeleteTextileProductUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileProductUseCase';
import { CreateTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileCertificationUseCase';
import { TextileCertification } from 'src/andean/domain/entities/textileProducts/TextileCertification';
import { CreateTextileCertificationDto } from './dto/textileProducts/CreateTextileCertificationDto';
import { UpdateTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileCertificationUseCase';
import { GetAllTextileCertificationsUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileCertificationsUseCase';
import { GetByIdTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileCertificationUseCase';
import { DeleteTextileCertificationUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileCertificationUseCase';
import { CreateColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/CreateColorOptionAlternativeUseCase';
import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';
import { CreateColorOptionAlternativeDto } from './dto/textileProducts/CreateColorOptionAlternativeDto';
import { GetAllColorOptionAlternativesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllColorOptionAlternativesUseCase';
import { GetByIdColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdColorOptionAlternativeUseCase';
import { UpdateColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateColorOptionAlternativeUseCase';
import { DeleteColorOptionAlternativeUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteColorOptionAlternativeUseCase';
import { CreateManyColorOptionAlternativesUseCase } from 'src/andean/app/use_cases/textileProducts/CreateManyColorOptionAlternativesUseCase';
import { CreateManyColorOptionAlternativesDto } from './dto/textileProducts/CreateManyColorOptionAlternativesDto';
import { PaginatedProductsResponse } from 'src/andean/app/modules/PaginatedProductsResponse';

const path_textile_product_id = '/:id';
const path_textile_categories = '/categories';
const path_textile_categories_id = '/categories/:id';
const path_textile_types = '/types';
const path_textile_types_id = '/types/:id';
const path_textile_styles = '/styles';
const path_textile_styles_id = '/styles/:id';
const path_textile_subcategories = '/subcategories';
const path_textile_subcategories_id = '/subcategories/:id';
const path_textile_craft_techniques = '/craft-techniques';
const path_textile_craft_techniques_id = '/craft-techniques/:id';
const path_textile_principal_uses = '/principal-uses';
const path_textile_principal_uses_id = '/principal-uses/:id';
const path_textile_certifications = '/certifications';
const path_textile_certifications_id = '/certifications/:id';
const path_textile_color_option_alternatives = '/color-option-alternatives';
const path_textile_color_option_alternatives_id =
	'/color-option-alternatives/:id';
const path_textile_color_option_alternatives_bulk =
	'/color-option-alternatives/bulk';

@Controller('textile-products')
export class TextileProductController {
	constructor(
		private readonly createTextileCategoryUseCase: CreateTextileCategoryUseCase,
		private readonly updateTextileCategoryUseCase: UpdateTextileCategoryUseCase,
		private readonly getAllTextileCategoriesUseCase: GetAllTextileCategoriesUseCase,
		private readonly getByIdTextileCategoryUseCase: GetByIdTextileCategoryUseCase,
		private readonly deleteTextileCategoryUseCase: DeleteTextileCategoryUseCase,
		private readonly createTextileTypeUseCase: CreateTextileTypeUseCase,
		private readonly updateTextileTypeUseCase: UpdateTextileTypeUseCase,
		private readonly getAllTextileTypesUseCase: GetAllTextileTypesUseCase,
		private readonly getByIdTextileTypeUseCase: GetByIdTextileTypeUseCase,
		private readonly deleteTextileTypeUseCase: DeleteTextileTypeUseCase,
		private readonly createTextileStyleUseCase: CreateTextileStyleUseCase,
		private readonly updateTextileStyleUseCase: UpdateTextileStyleUseCase,
		private readonly getAllTextileStylesUseCase: GetAllTextileStylesUseCase,
		private readonly getByIdTextileStyleUseCase: GetByIdTextileStyleUseCase,
		private readonly deleteTextileStyleUseCase: DeleteTextileStyleUseCase,
		private readonly createTextileSubcategoryUseCase: CreateTextileSubcategoryUseCase,
		private readonly updateTextileSubcategoryUseCase: UpdateTextileSubcategoryUseCase,
		private readonly getAllTextileSubcategoriesUseCase: GetAllTextileSubcategoriesUseCase,
		private readonly getByIdTextileSubcategoryUseCase: GetByIdTextileSubcategoryUseCase,
		private readonly deleteTextileSubcategoryUseCase: DeleteTextileSubcategoryUseCase,
		private readonly createTextileCraftTechniqueUseCase: CreateTextileCraftTechniqueUseCase,
		private readonly updateTextileCraftTechniqueUseCase: UpdateTextileCraftTechniqueUseCase,
		private readonly getAllTextileCraftTechniquesUseCase: GetAllTextileCraftTechniquesUseCase,
		private readonly getByIdTextileCraftTechniqueUseCase: GetByIdTextileCraftTechniqueUseCase,
		private readonly deleteTextileCraftTechniqueUseCase: DeleteTextileCraftTechniqueUseCase,
		private readonly createTextilePrincipalUseUseCase: CreateTextilePrincipalUseUseCase,
		private readonly updateTextilePrincipalUseUseCase: UpdateTextilePrincipalUseUseCase,
		private readonly getAllTextilePrincipalUsesUseCase: GetAllTextilePrincipalUsesUseCase,
		private readonly getByIdTextilePrincipalUseUseCase: GetByIdTextilePrincipalUseUseCase,
		private readonly deleteTextilePrincipalUseUseCase: DeleteTextilePrincipalUseUseCase,
		private readonly createTextileProductUseCase: CreateTextileProductUseCase,
		private readonly updateTextileProductUseCase: UpdateTextileProductUseCase,
		private readonly getAllTextileProductsUseCase: GetAllTextileProductsUseCase,
		private readonly getByIdTextileProductUseCase: GetByIdTextileProductUseCase,
		private readonly deleteTextileProductUseCase: DeleteTextileProductUseCase,
		private readonly createTextileCertificationUseCase: CreateTextileCertificationUseCase,
		private readonly updateTextileCertificationUseCase: UpdateTextileCertificationUseCase,
		private readonly getAllTextileCertificationsUseCase: GetAllTextileCertificationsUseCase,
		private readonly getByIdTextileCertificationUseCase: GetByIdTextileCertificationUseCase,
		private readonly deleteTextileCertificationUseCase: DeleteTextileCertificationUseCase,
		private readonly createColorOptionAlternativeUseCase: CreateColorOptionAlternativeUseCase,
		private readonly updateColorOptionAlternativeUseCase: UpdateColorOptionAlternativeUseCase,
		private readonly getAllColorOptionAlternativesUseCase: GetAllColorOptionAlternativesUseCase,
		private readonly getByIdColorOptionAlternativeUseCase: GetByIdColorOptionAlternativeUseCase,
		private readonly deleteColorOptionAlternativeUseCase: DeleteColorOptionAlternativeUseCase,
		private readonly createManyColorOptionAlternativesUseCase: CreateManyColorOptionAlternativesUseCase,
	) { }

	@Post(path_textile_categories)
	async createTextileCategory(
		@Body() body: CreateTextileCategoryDto,
	): Promise<TextileCategory> {
		return this.createTextileCategoryUseCase.handle(body);
	}

	@Put(path_textile_categories_id)
	async updateTextileCategory(
		@Param('id') id: string,
		@Body() body: CreateTextileCategoryDto,
	): Promise<TextileCategory> {
		return this.updateTextileCategoryUseCase.handle(id, body);
	}

	@Get(path_textile_categories)
	async getAllTextileCategories(): Promise<TextileCategory[]> {
		return this.getAllTextileCategoriesUseCase.handle();
	}

	@Get(path_textile_categories_id)
	async getByIdTextileCategory(
		@Param('id') id: string,
	): Promise<TextileCategory> {
		return this.getByIdTextileCategoryUseCase.handle(id);
	}

	@Delete(path_textile_categories_id)
	async deleteTextileCategory(@Param('id') id: string): Promise<void> {
		return this.deleteTextileCategoryUseCase.handle(id);
	}

	@Post(path_textile_types)
	async createTextileType(
		@Body() body: CreateTextileTypeDto,
	): Promise<TextileType> {
		return this.createTextileTypeUseCase.handle(body);
	}

	@Put(path_textile_types_id)
	async updateTextileType(
		@Param('id') id: string,
		@Body() body: CreateTextileTypeDto,
	): Promise<TextileType> {
		return this.updateTextileTypeUseCase.handle(id, body);
	}

	@Get(path_textile_types)
	async getAllTextileTypes(): Promise<TextileType[]> {
		return this.getAllTextileTypesUseCase.handle();
	}

	@Get(path_textile_types_id)
	async getByIdTextileType(@Param('id') id: string): Promise<TextileType> {
		return this.getByIdTextileTypeUseCase.handle(id);
	}

	@Delete(path_textile_types_id)
	async deleteTextileType(@Param('id') id: string): Promise<void> {
		return this.deleteTextileTypeUseCase.handle(id);
	}

	@Post(path_textile_styles)
	async createTextileStyle(
		@Body() body: CreateTextileStyleDto,
	): Promise<TextileStyle> {
		return this.createTextileStyleUseCase.handle(body);
	}

	@Put(path_textile_styles_id)
	async updateTextileStyle(
		@Param('id') id: string,
		@Body() body: CreateTextileStyleDto,
	): Promise<TextileStyle> {
		return this.updateTextileStyleUseCase.handle(id, body);
	}

	@Get(path_textile_styles)
	async getAllTextileStyles(): Promise<TextileStyle[]> {
		return this.getAllTextileStylesUseCase.handle();
	}

	@Get(path_textile_styles_id)
	async getByIdTextileStyle(@Param('id') id: string): Promise<TextileStyle> {
		return this.getByIdTextileStyleUseCase.handle(id);
	}

	@Delete(path_textile_styles_id)
	async deleteTextileStyle(@Param('id') id: string): Promise<void> {
		return this.deleteTextileStyleUseCase.handle(id);
	}

	@Post(path_textile_subcategories)
	async createTextileSubcategory(
		@Body() body: CreateTextileSubcategoryDto,
	): Promise<TextileSubcategory> {
		return this.createTextileSubcategoryUseCase.handle(body);
	}

	@Put(path_textile_subcategories_id)
	async updateTextileSubcategory(
		@Param('id') id: string,
		@Body() body: CreateTextileSubcategoryDto,
	): Promise<TextileSubcategory> {
		return this.updateTextileSubcategoryUseCase.handle(id, body);
	}

	@Get(path_textile_subcategories)
	async getAllTextileSubcategories(): Promise<TextileSubcategory[]> {
		return this.getAllTextileSubcategoriesUseCase.handle();
	}

	@Get(path_textile_subcategories_id)
	async getByIdTextileSubcategory(
		@Param('id') id: string,
	): Promise<TextileSubcategory> {
		return this.getByIdTextileSubcategoryUseCase.handle(id);
	}

	@Delete(path_textile_subcategories_id)
	async deleteTextileSubcategory(@Param('id') id: string): Promise<void> {
		return this.deleteTextileSubcategoryUseCase.handle(id);
	}

	@Post(path_textile_craft_techniques)
	async createTextileCraftTechnique(
		@Body() body: CreateTextileCraftTechniqueDto,
	): Promise<TextileCraftTechnique> {
		return this.createTextileCraftTechniqueUseCase.handle(body);
	}

	@Put(path_textile_craft_techniques_id)
	async updateTextileCraftTechnique(
		@Param('id') id: string,
		@Body() body: CreateTextileCraftTechniqueDto,
	): Promise<TextileCraftTechnique> {
		return this.updateTextileCraftTechniqueUseCase.handle(id, body);
	}

	@Get(path_textile_craft_techniques)
	async getAllTextileCraftTechniques(): Promise<TextileCraftTechnique[]> {
		return this.getAllTextileCraftTechniquesUseCase.handle();
	}

	@Get(path_textile_craft_techniques_id)
	async getByIdTextileCraftTechnique(
		@Param('id') id: string,
	): Promise<TextileCraftTechnique> {
		return this.getByIdTextileCraftTechniqueUseCase.handle(id);
	}

	@Delete(path_textile_craft_techniques_id)
	async deleteTextileCraftTechnique(@Param('id') id: string): Promise<void> {
		return this.deleteTextileCraftTechniqueUseCase.handle(id);
	}

	@Post(path_textile_principal_uses)
	async createTextilePrincipalUse(
		@Body() body: CreateTextilePrincipalUseDto,
	): Promise<TextilePrincipalUse> {
		return this.createTextilePrincipalUseUseCase.handle(body);
	}

	@Put(path_textile_principal_uses_id)
	async updateTextilePrincipalUse(
		@Param('id') id: string,
		@Body() body: CreateTextilePrincipalUseDto,
	): Promise<TextilePrincipalUse> {
		return this.updateTextilePrincipalUseUseCase.handle(id, body);
	}

	@Get(path_textile_principal_uses)
	async getAllTextilePrincipalUses(): Promise<TextilePrincipalUse[]> {
		return this.getAllTextilePrincipalUsesUseCase.handle();
	}

	@Get(path_textile_principal_uses_id)
	async getByIdTextilePrincipalUse(
		@Param('id') id: string,
	): Promise<TextilePrincipalUse> {
		return this.getByIdTextilePrincipalUseUseCase.handle(id);
	}

	@Delete(path_textile_principal_uses_id)
	async deleteTextilePrincipalUse(@Param('id') id: string): Promise<void> {
		return this.deleteTextilePrincipalUseUseCase.handle(id);
	}

	@Post()
	async createTextileProduct(
		@Body() body: CreateTextileProductDto,
	): Promise<TextileProduct> {
		return this.createTextileProductUseCase.handle(body);
	}

	@Put(path_textile_product_id)
	async updateTextileProduct(
		@Param('id') id: string,
		@Body() body: CreateTextileProductDto,
	): Promise<TextileProduct> {
		return this.updateTextileProductUseCase.handle(id, body);
	}

	@Get()
	async getAllTextileProducts(
		@Query('page', new ParseIntPipe({ optional: true })) page?: number,
		@Query('per_page', new ParseIntPipe({ optional: true })) perPage?: number,
	): Promise<PaginatedProductsResponse<TextileProduct>> {
		return this.getAllTextileProductsUseCase.handle(page, perPage);
	}

	@Get(path_textile_product_id)
	async getByIdTextileProduct(
		@Param('id') id: string,
	): Promise<TextileProduct> {
		return this.getByIdTextileProductUseCase.handle(id);
	}

	@Delete(path_textile_product_id)
	async deleteTextileProduct(@Param('id') id: string): Promise<void> {
		return this.deleteTextileProductUseCase.handle(id);
	}

	@Post(path_textile_certifications)
	async createTextileCertification(
		@Body() body: CreateTextileCertificationDto,
	): Promise<TextileCertification> {
		return this.createTextileCertificationUseCase.handle(body);
	}

	@Put(path_textile_certifications_id)
	async updateTextileCertification(
		@Param('id') id: string,
		@Body() body: CreateTextileCertificationDto,
	): Promise<TextileCertification> {
		return this.updateTextileCertificationUseCase.handle(id, body);
	}

	@Get(path_textile_certifications)
	async getAllTextileCertifications(): Promise<TextileCertification[]> {
		return this.getAllTextileCertificationsUseCase.handle();
	}

	@Get(path_textile_certifications_id)
	async getByIdTextileCertification(
		@Param('id') id: string,
	): Promise<TextileCertification> {
		return this.getByIdTextileCertificationUseCase.handle(id);
	}

	@Delete(path_textile_certifications_id)
	async deleteTextileCertification(@Param('id') id: string): Promise<void> {
		return this.deleteTextileCertificationUseCase.handle(id);
	}

	@Post(path_textile_color_option_alternatives)
	async createColorOptionAlternative(
		@Body() body: CreateColorOptionAlternativeDto,
	): Promise<ColorOptionAlternative> {
		return this.createColorOptionAlternativeUseCase.handle(body);
	}

	@Post(path_textile_color_option_alternatives_bulk)
	async createManyColorOptionAlternatives(
		@Body() body: CreateManyColorOptionAlternativesDto,
	): Promise<ColorOptionAlternative[]> {
		return this.createManyColorOptionAlternativesUseCase.handle(body);
	}

	@Put(path_textile_color_option_alternatives_id)
	async updateColorOptionAlternative(
		@Param('id') id: string,
		@Body() body: CreateColorOptionAlternativeDto,
	): Promise<ColorOptionAlternative> {
		return this.updateColorOptionAlternativeUseCase.handle(id, body);
	}

	@Get(path_textile_color_option_alternatives)
	async getAllColorOptionAlternatives(): Promise<ColorOptionAlternative[]> {
		return this.getAllColorOptionAlternativesUseCase.handle();
	}

	@Get(path_textile_color_option_alternatives_id)
	async getByIdColorOptionAlternative(
		@Param('id') id: string,
	): Promise<ColorOptionAlternative> {
		return this.getByIdColorOptionAlternativeUseCase.handle(id);
	}

	@Delete(path_textile_color_option_alternatives_id)
	async deleteColorOptionAlternative(@Param('id') id: string): Promise<void> {
		return this.deleteColorOptionAlternativeUseCase.handle(id);
	}
}
