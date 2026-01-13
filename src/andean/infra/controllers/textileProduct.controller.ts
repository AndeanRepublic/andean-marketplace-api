import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
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

const path_textile_categories = '/categories';
const path_textile_categories_id = '/categories/:id';
const path_textile_types = '/types';
const path_textile_types_id = '/types/:id';
const path_textile_styles = '/styles';
const path_textile_styles_id = '/styles/:id';
const path_textile_subcategories = '/subcategories';
const path_textile_subcategories_id = '/subcategories/:id';

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
  ) {}

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
}
