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

const path_textile_categories = '/categories';
const path_textile_categories_id = '/categories/:id';
const path_textile_types = '/types';
const path_textile_types_id = '/types/:id';

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
}
