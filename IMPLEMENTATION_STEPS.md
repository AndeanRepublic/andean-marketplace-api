# Pasos de Implementación Completa: De Entidades a Tests

## 📖 Introducción

Este documento describe los pasos detallados para implementar un módulo completo desde las entidades de dominio hasta los tests, incluyendo repositorios, casos de uso, controladores y pruebas.

**Prerrequisito:** Haber completado las fases base descritas en [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md):

- ✅ Enums
- ✅ Entidades de Dominio
- ✅ Schemas de Persistencia
- ✅ DTOs
- ✅ Mappers
- ✅ Response Models

---

## 📋 Índice de Pasos

1. [Crear Repositorios](#paso-7-crear-repositorios)
2. [Crear Casos de Uso](#paso-8-crear-casos-de-uso)
3. [Crear Controladores](#paso-9-crear-controladores)
4. [Crear Módulo NestJS](#paso-10-crear-módulo-nestjs)
5. [Implementar Validaciones de Negocio](#paso-11-implementar-validaciones-de-negocio)
6. [Agregar Tests Unitarios](#paso-12-agregar-tests-unitarios)
7. [Agregar Tests de Integración](#paso-13-agregar-tests-de-integración)
8. [Documentación API](#paso-14-documentación-api)

---

## Paso 7: Crear Repositorios

**Ubicación:** `src/andean/app/datastore/`

### 7.1 Crear Clase Abstracta del Repositorio

El repositorio define el contrato de acceso a datos usando una clase abstracta, independiente de la implementación.

**Plantilla:**

```typescript
// [entidad].repo.ts
import { [Entidad] } from '../../domain/entities/[modulo]/[Entidad]';

export abstract class [Entidad]Repository {
  abstract create(entity: [Entidad]): Promise<[Entidad]>;
  abstract findById(id: string): Promise<[Entidad] | null>;
  abstract findAll(filters?: any): Promise<[Entidad][]>;
  abstract update(
    id: string,
    entity: Partial<[Entidad]>,
  ): Promise<[Entidad] | null>;
  abstract delete(id: string): Promise<boolean>;

  // Métodos específicos del dominio
  abstract findByOwnerId(ownerId: string): Promise<[Entidad][]>;
  abstract findByStatus(status: [Status]): Promise<[Entidad][]>;
}
```

**Ejemplo:**

```typescript
// community.repo.ts
import { Community } from '../../domain/entities/community/Community';

export abstract class CommunityRepository {
	abstract create(community: Community): Promise<Community>;
	abstract findById(id: string): Promise<Community | null>;
	abstract findAll(): Promise<Community[]>;
	abstract findByName(name: string): Promise<Community | null>;
	abstract update(
		id: string,
		community: Partial<Community>,
	): Promise<Community | null>;
	abstract delete(id: string): Promise<boolean>;
}
```

### 7.2 Implementar el Repositorio

**Ubicación:** `src/andean/infra/datastore/`

**Plantilla:**

```typescript
// [entidad].repo.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { [Entidad]Repository } from '../../app/datastore/[entidad].repo';
import { [Entidad] } from '../../domain/entities/[modulo]/[Entidad]';
import { [Entidad]Document } from '../persistence/[entidad].schema';
import { [Entidad]Mapper } from '../services/[Entidad]Mapper';

@Injectable()
export class [Entidad]RepositoryImpl extends [Entidad]RepositoryBase {
  constructor(
    @InjectModel('[Entidad]') private [entidad]Model: Model<[Entidad]Document>,
  ) {
    super();
  }

  async create(entity: [Entidad]): Promise<[Entidad]> {
    const document = [Entidad]Mapper.toDocument(entity);
    const created = await this.[entidad]Model.create(document);
    return [Entidad]Mapper.fromDocument(created);
  }

  async findById(id: string): Promise<[Entidad] | null> {
    const document = await this.[entidad]Model.findOne({ id }).exec();
    return document ? [Entidad]Mapper.fromDocument(document) : null;
  }

  async findAll(filters?: any): Promise<[Entidad][]> {
    const query = this.buildQuery(filters);
    const documents = await this.[entidad]Model.find(query).exec();
    return documents.map((doc) => [Entidad]Mapper.fromDocument(doc));
  }

  async update(id: string, entity: Partial<[Entidad]>): Promise<[Entidad] | null> {
    const updateData = {
      ...entity,
      updatedAt: new Date(),
    };

    const updated = await this.[entidad]Model
      .findOneAndUpdate({ id }, updateData, { new: true })
      .exec();

    return updated ? [Entidad]Mapper.fromDocument(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.[entidad]Model.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  // Métodos auxiliares
  private buildQuery(filters?: any): any {
    const query: any = {};

    if (filters?.categoryId) {
      query.categoryId = filters.categoryId;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.ownerId) {
      query['baseInfo.ownerId'] = filters.ownerId;
    }

    return query;
  }
}
```

---

## Paso 8: Crear Casos de Uso

**Ubicación:** `src/andean/app/use_cases/[modulo]/`

Los casos de uso contienen la lógica de negocio y orquestan las operaciones.

### 8.1 Create Use Case

**🎯 Regla Importante:** Los use cases NO deben construir entidades directamente. Siempre usar el mapper con `fromCreateDto()`.

**Plantilla:**

```typescript
// Create[Entidad]UseCase.ts
import { Injectable } from '@nestjs/common';
import { [Entidad]Repository } from '../../datastore/[entidad].repo';
import { [Entidad] } from '../../../domain/entities/[modulo]/[Entidad]';
import { Create[Entidad]Dto } from '../../../infra/controllers/dto/[modulo]/Create[Entidad]Dto';
import { [Entidad]Mapper } from '../../../infra/services/[Entidad]Mapper';

@Injectable()
export class Create[Entidad]UseCase {
  constructor(
    private readonly [entidad]Repository: [Entidad]Repository,
  ) {}

  async execute(dto: Create[Entidad]Dto): Promise<[Entidad]> {
    // 1. Validaciones de negocio (existencia, permisos, reglas complejas)
    await this.validateBusinessRules(dto);

    // 2. Crear entidad usando mapper (NO construir directamente)
    const entity = [Entidad]Mapper.fromCreateDto(dto);

    // 3. Persistir
    const created = await this.[entidad]Repository.create(entity);

    // 4. Acciones post-creación (opcional)
    await this.postCreation(created);

    return created;
  }

  private async validateBusinessRules(dto: Create[Entidad]Dto): Promise<void> {
    // ✅ Validar existencia de entidades relacionadas
    // ✅ Validar permisos y autorización
    // ✅ Reglas de negocio que requieren consultas a BD
    // ❌ NO validar tipos, rangos, formatos (eso va en DTOs)
  }

  private async postCreation(entity: [Entidad]): Promise<void> {
    // Enviar notificaciones
    // Actualizar índices
    // Etc.
  }
}
```

**Ejemplo:**

```typescript
// CreateCommunityUseCase.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { CommunityRepository } from '../../datastore/community.repo';
import { Community } from '../../../domain/entities/community/Community';
import { CreateCommunityDto } from '../../../infra/controllers/dto/community/CreateCommunityDto';
import { CommunityMapper } from '../../../infra/services/CommunityMapper';

@Injectable()
export class CreateCommunityUseCase {
  constructor(
    private readonly communityRepository: CommunityRepository,
  ) {}

  async execute(dto: CreateCommunityDto): Promise<Community> {
    // Validar que no exista una comunidad con el mismo nombre
    const existingCommunity = await this.communityRepository.findByName(dto.name);
    if (existingCommunity) {
      throw new BadRequestException(`Community with name "${dto.name}" already exists`);
    }

    // Crear entidad usando mapper
    const community = CommunityMapper.fromCreateDto(dto);

    // Persistir
    return await this.communityRepository.create(community);
  }
}
}
```

### 8.2 Update Use Case

**Opciones de implementación:**

**Opción 1: Pasar DTO directamente al repositorio** (recomendado para casos simples)

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class Update[Entidad]UseCase {
  constructor(
    private readonly [entidad]Repository: [Entidad]Repository,
  ) {}

  async execute(id: string, dto: Update[Entidad]Dto): Promise<[Entidad]> {
    // 1. Verificar existencia
    const existing = await this.[entidad]Repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`[Entidad] with id ${id} not found`);
    }

    // 2. Validar cambios permitidos (existencia, permisos, reglas complejas)
    await this.validateUpdate(existing, dto);

    // 3. Actualizar directamente con DTO
    const updated = await this.[entidad]Repository.update(id, dto);

    if (!updated) {
      throw new NotFoundException(`Failed to update [Entidad]`);
    }

    return updated;
  }

  private async validateUpdate(
    existing: [Entidad],
    dto: Update[Entidad]Dto,
  ): Promise<void> {
    // ✅ Validar transiciones de estado permitidas
    // ✅ Validar permisos
    // ✅ Validar existencia de referencias
  }
}
```

**Opción 2: Usar mapper cuando necesites la entidad completa** (para validaciones de dominio)

```typescript
import { [Entidad]Mapper } from '../../../infra/services/[Entidad]Mapper';

@Injectable()
export class Update[Entidad]UseCase {
  constructor(
    private readonly [entidad]Repository: [Entidad]Repository,
  ) {}

  async execute(id: string, dto: Update[Entidad]Dto): Promise<[Entidad]> {
    const existing = await this.[entidad]Repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`[Entidad] with id ${id} not found`);
    }

    // Crear entidad actualizada usando mapper
    const updatedEntity = [Entidad]Mapper.fromUpdateDto(dto, existing);

    // Validar la entidad completa (si hay invariantes de dominio)
    await this.validateEntity(updatedEntity);

    // Actualizar (puedes pasar la entidad o extraer campos)
    const updated = await this.[entidad]Repository.update(id, dto);

    return updated;
  }
}
```

**Cuándo usar cada opción:**

- **Opción 1**: La mayoría de los casos (validaciones simples de negocio)
- **Opción 2**: Cuando necesitas validar invariantes de dominio complejos

### 8.3 Get/List Use Cases

```typescript
// Get[Entidad]ByIdUseCase.ts
@Injectable()
export class Get[Entidad]ByIdUseCase {
  constructor(
    private readonly [entidad]Repository: [Entidad]Repository,
  ) {}

  async execute(id: string): Promise<[Entidad]> {
    const entity = await this.[entidad]Repository.findById(id);

    if (!entity) {
      throw new NotFoundException(`[Entidad] with id ${id} not found`);
    }

    return entity;
  }
}

// List[Entidad]UseCase.ts
@Injectable()
export class List[Entidad]UseCase {
  constructor(
    private readonly [entidad]Repository: [Entidad]Repository,
  ) {}

  async execute(filters?: any): Promise<[Entidad][]> {
    return await this.[entidad]Repository.findAll(filters);
  }
}
```

### 8.4 Delete Use Case

```typescript
@Injectable()
export class Delete[Entidad]UseCase {
  constructor(
    private readonly [entidad]Repository: [Entidad]Repository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.[entidad]Repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`[Entidad] with id ${id} not found`);
    }

    // Validar que se puede eliminar
    await this.validateDeletion(existing);

    const deleted = await this.[entidad]Repository.delete(id);

    if (!deleted) {
      throw new BadRequestException('Failed to delete [Entidad]');
    }
  }

  private async validateDeletion(entity: [Entidad]): Promise<void> {
    // Verificar que no tenga dependencias
    // Verificar permisos
  }
}
```

---

## Paso 9: Crear Controladores

**Ubicación:** `src/andean/infra/controllers/`

### 9.1 Controlador REST

**Plantilla:**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Create[Entidad]UseCase } from '../../app/use_cases/[modulo]/Create[Entidad]UseCase';
import { Update[Entidad]UseCase } from '../../app/use_cases/[modulo]/Update[Entidad]UseCase';
import { Get[Entidad]ByIdUseCase } from '../../app/use_cases/[modulo]/Get[Entidad]ByIdUseCase';
import { List[Entidad]UseCase } from '../../app/use_cases/[modulo]/List[Entidad]UseCase';
import { Delete[Entidad]UseCase } from '../../app/use_cases/[modulo]/Delete[Entidad]UseCase';
import { Create[Entidad]Dto } from './dto/[modulo]/Create[Entidad]Dto';
import { Update[Entidad]Dto } from './dto/[modulo]/Update[Entidad]Dto';
import { [Entidad]Response } from '../../app/modules/[Entidad]Response';

@ApiTags('[Entidades]')
@Controller('[entidades]')
export class [Entidad]Controller {
  constructor(
    private readonly create[Entidad]UseCase: Create[Entidad]UseCase,
    private readonly update[Entidad]UseCase: Update[Entidad]UseCase,
    private readonly get[Entidad]ByIdUseCase: Get[Entidad]ByIdUseCase,
    private readonly list[Entidad]UseCase: List[Entidad]UseCase,
    private readonly delete[Entidad]UseCase: Delete[Entidad]UseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new [entidad]' })
  @ApiResponse({
    status: 201,
    description: 'The [entidad] has been successfully created.',
    type: [Entidad]Response,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() dto: Create[Entidad]Dto): Promise<[Entidad]Response> {
    const entity = await this.create[Entidad]UseCase.execute(dto);
    return this.toResponse(entity);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get [entidad] by ID' })
  @ApiParam({ name: 'id', description: '[Entidad] ID' })
  @ApiResponse({
    status: 200,
    description: 'The [entidad] has been found.',
    type: [Entidad]Response,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async getById(@Param('id') id: string): Promise<[Entidad]Response> {
    const entity = await this.get[Entidad]ByIdUseCase.execute(id);
    return this.toResponse(entity);
  }

  @Get()
  @ApiOperation({ summary: 'List all [entidades]' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of [entidades].',
    type: [[Entidad]Response],
  })
  async list(
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
  ): Promise<[Entidad]Response[]> {
    const filters = { categoryId, status };
    const entities = await this.list[Entidad]UseCase.execute(filters);
    return entities.map((e) => this.toResponse(e));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update [entidad]' })
  @ApiParam({ name: 'id', description: '[Entidad] ID' })
  @ApiResponse({
    status: 200,
    description: 'The [entidad] has been successfully updated.',
    type: [Entidad]Response,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async update(
    @Param('id') id: string,
    @Body() dto: Update[Entidad]Dto,
  ): Promise<[Entidad]Response> {
    const entity = await this.update[Entidad]UseCase.execute(id, dto);
    return this.toResponse(entity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete [entidad]' })
  @ApiParam({ name: 'id', description: '[Entidad] ID' })
  @ApiResponse({ status: 204, description: 'The [entidad] has been deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.delete[Entidad]UseCase.execute(id);
  }

  // Helper para convertir entidad a response
  private toResponse(entity: [Entidad]): [Entidad]Response {
    return {
      id: entity.id,
      campo1: entity.campo1,
      campo2: entity.campo2,
      // ... mapear todos los campos
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
```

---

## Paso 10: Crear Módulo NestJS

**Ubicación:** `src/andean/[entidad].module.ts`

**Plantilla:**

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import {
  [Entidad]Schema,
  [Entidad]Document,
} from './infra/persistence/[entidad].schema';
import {
  [Referencia]Schema,
  [Referencia]Document,
} from './infra/persistence/[referencia].schema';

// Repository
import { [Entidad]Repository } from './app/datastore/[entidad].repo';
import { [Entidad]RepositoryImpl } from './infra/datastore/[entidad].repo.impl';

// Use Cases
import { Create[Entidad]UseCase } from './app/use_cases/[modulo]/Create[Entidad]UseCase';
import { Update[Entidad]UseCase } from './app/use_cases/[modulo]/Update[Entidad]UseCase';
import { Get[Entidad]ByIdUseCase } from './app/use_cases/[modulo]/Get[Entidad]ByIdUseCase';
import { List[Entidad]UseCase } from './app/use_cases/[modulo]/List[Entidad]UseCase';
import { Delete[Entidad]UseCase } from './app/use_cases/[modulo]/Delete[Entidad]UseCase';

// Controllers
import { [Entidad]Controller } from './infra/controllers/[entidad].controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: '[Entidad]', schema: [Entidad]Schema },
      { name: '[Referencia]', schema: [Referencia]Schema },
      // ... otros schemas necesarios
    ]),
  ],
  controllers: [[Entidad]Controller],
  providers: [
    // Repository
    {
      provide: [Entidad]Repository,
      useClass: [Entidad]RepositoryImpl,
    },

    // Use Cases
    Create[Entidad]UseCase,
    Update[Entidad]UseCase,
    Get[Entidad]ByIdUseCase,
    List[Entidad]UseCase,
    Delete[Entidad]UseCase,
  ],
  exports: [
    [Entidad]Repository,
    // Exportar use cases si otros módulos los necesitan
  ],
})
export class [Entidad]Module {}
```

**Ejemplo:**

```typescript
// community.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunitySchema } from './infra/persistence/community.schema';
import { CommunityRepository } from './app/datastore/community.repo';
import { CommunityRepositoryImpl } from './infra/datastore/community.repo.impl';
import { CreateCommunityUseCase } from './app/use_cases/community/CreateCommunityUseCase';
import { UpdateCommunityUseCase } from './app/use_cases/community/UpdateCommunityUseCase';
import { GetCommunityByIdUseCase } from './app/use_cases/community/GetCommunityByIdUseCase';
import { ListCommunityUseCase } from './app/use_cases/community/ListCommunityUseCase';
import { DeleteCommunityUseCase } from './app/use_cases/community/DeleteCommunityUseCase';
import { CommunityController } from './infra/controllers/community.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Community', schema: CommunitySchema }]),
	],
	controllers: [CommunityController],
	providers: [
		{
			provide: CommunityRepository,
			useClass: CommunityRepositoryImpl,
		},
		CreateCommunityUseCase,
		UpdateCommunityUseCase,
		GetCommunityByIdUseCase,
		ListCommunityUseCase,
		DeleteCommunityUseCase,
	],
	exports: [CommunityRepository],
})
export class CommunityModule {}
```

### 10.2 Registrar en App Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { [Entidad]Module } from './andean/[entidad].module';

@Module({
  imports: [
    // ... otros módulos
    [Entidad]Module,
  ],
})
export class AppModule {}
```

---

## Paso 11: Implementar Validaciones de Negocio

### 🎯 Regla de Oro: Validaciones en DTOs primero

**Todas las validaciones simples DEBEN ir en los DTOs:**

- Tipos de datos (`@IsString()`, `@IsNumber()`)
- Rangos numéricos (`@Min()`, `@Max()`)
- Longitudes de texto (`@MinLength()`, `@MaxLength()`)
- Valores permitidos (`@IsEnum()`)
- Formatos (`@IsEmail()`, `@IsUrl()`)
- Validaciones de array/objeto (`@IsArray()`, `@ValidateNested()`)

### 11.1 Validaciones en DTOs

**✅ Ejemplos correctos:**

```typescript
// Precio debe ser positivo
@ApiProperty({ description: 'Precio base', minimum: 0.01 })
@IsNumber()
@Min(0.01, { message: 'Base price must be greater than 0' })
basePrice: number;

// Stock no negativo
@ApiProperty({ minimum: 0 })
@IsNumber()
@Min(0, { message: 'Stock cannot be negative' })
totalStock: number;

// Título con longitud específica
@IsString()
@MinLength(3)
@MaxLength(100)
title: string;

// Custom validator para lógica compleja
@UniqueVariantCombinations({ message: 'Duplicate combinations found' })
variants?: CreateVariantDto[];
```

**❌ INCORRECTO - NO hacer en Use Cases:**

```typescript
// ❌ MAL: Validación simple en use case
if (dto.basePrice <= 0) {
	throw new BadRequestException('Price must be greater than 0');
}

// ✅ BIEN: Esto debe estar en el DTO con @Min(0.01)
```

### 11.2 Validaciones en Use Cases (solo lógica compleja)

**Solo para validaciones que requieren:**

- Consultas a la base de datos
- Lógica de negocio compleja
- Verificación de permisos
- Transiciones de estado

**Tipos de validaciones permitidas en Use Cases:**

1. **Existencia de referencias** (requiere consulta a BD)

```typescript
private async validateCategoryExists(categoryId: string): Promise<void> {
  const category = await this.categoryRepository.findById(categoryId);
  if (!category) {
    throw new BadRequestException(`Category ${categoryId} does not exist`);
  }
}
```

2. **Reglas de negocio**

```typescript
private validateStockVariants(variants: SuperfoodVariant[], totalStock: number): void {
  const variantsStock = variants.reduce((sum, v) => sum + v.stock, 0);

  if (variantsStock !== totalStock) {
    throw new BadRequestException(
      'Sum of variant stocks must equal total stock'
    );
  }
}
```

3. **Transiciones de estado**

```typescript
private validateStatusTransition(
  currentStatus: SuperfoodProductStatus,
  newStatus: SuperfoodProductStatus,
): void {
  const allowedTransitions = {
    [SuperfoodProductStatus.PENDING]: [
      SuperfoodProductStatus.PUBLISHED,
      SuperfoodProductStatus.HIDDEN,
    ],
    [SuperfoodProductStatus.PUBLISHED]: [
      SuperfoodProductStatus.HIDDEN,
      SuperfoodProductStatus.SOLD_OUT,
    ],
    // ...
  };

  if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
    throw new BadRequestException(
      `Cannot transition from ${currentStatus} to ${newStatus}`
    );
  }
}
```

4. **Permisos y autorización**

```typescript
private async validateUserCanModify(
  userId: string,
  superfood: SuperfoodProduct,
): Promise<void> {
  if (superfood.baseInfo.ownerId !== userId) {
    throw new ForbiddenException('You do not have permission to modify this product');
  }
}
```

### 11.3 Anti-patrones: Qué NO hacer

**❌ INCORRECTO: Validaciones simples en Use Cases**

```typescript
// ❌ MAL
if (dto.priceInventory.basePrice <= 0) {
	throw new BadRequestException('El precio base debe ser mayor a 0');
}

if (dto.priceInventory.totalStock < 0) {
	throw new BadRequestException('El stock total no puede ser negativo');
}

if (variant.price < 0) {
	throw new BadRequestException('El precio no puede ser negativo');
}
```

**✅ CORRECTO: Estas validaciones en DTOs**

```typescript
// ✅ BIEN - En CreateSuperfoodPriceInventoryDto
@Min(0.01, { message: 'Base price must be greater than 0' })
basePrice: number;

@Min(0, { message: 'Total stock cannot be negative' })
totalStock: number;

// ✅ BIEN - En CreateSuperfoodVariantDto
@Min(0, { message: 'Variant price must be greater than or equal to 0' })
price: number;
```

**Resumen:**

- ✅ DTOs: Validaciones de formato, tipo, rango, longitud
- ✅ Use Cases: Validaciones de existencia, permisos, reglas complejas
- ❌ Use Cases: Validaciones simples que pueden ser decoradores

---

## Paso 12: Agregar Tests Unitarios

**Ubicación:** `test/unit/[modulo]/`

### 12.1 Test de Entidades

```typescript
// [Entidad].spec.ts
import { [Entidad] } from '../../../src/andean/domain/entities/[modulo]/[Entidad]';

describe('[Entidad] Entity', () => {
  describe('constructor', () => {
    it('should create a valid entity', () => {
      // Arrange
      const id = 'test-id';
      const campo1 = 'valor1';

      // Act
      const entity = new [Entidad](id, campo1, ...);

      // Assert
      expect(entity.id).toBe(id);
      expect(entity.campo1).toBe(campo1);
    });
  });
});
```

### 12.2 Test de Mappers

```typescript
// [Entidad]Mapper.spec.ts
import { [Entidad]Mapper } from '../../../src/andean/infra/services/[Entidad]Mapper';
import { [Entidad]Document } from '../../../src/andean/infra/persistence/[entidad].schema';

describe('[Entidad]Mapper', () => {
  describe('fromDocument', () => {
    it('should map document to entity correctly', () => {
      // Arrange
      const document = {
        id: 'test-id',
        campo1: 'valor1',
        // ...
      } as [Entidad]Document;

      // Act
      const entity = [Entidad]Mapper.fromDocument(document);

      // Assert
      expect(entity.id).toBe(document.id);
      expect(entity.campo1).toBe(document.campo1);
    });
  });

  describe('toDocument', () => {
    it('should map DTO to document correctly', () => {
      // Arrange
      const dto = {
        campo1: 'valor1',
        // ...
      };

      // Act
      const document = [Entidad]Mapper.toDocument(dto);

      // Assert
      expect(document.campo1).toBe(dto.campo1);
      expect(document.id).toBeDefined();
    });
  });
});
```

### 12.3 Test de Repositorios

```typescript
// [entidad].repository.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { [Entidad]Repository } from '../../../src/andean/infra/datastore/[entidad].repository';
import { [Entidad]Document } from '../../../src/andean/infra/persistence/[entidad].schema';

describe('[Entidad]Repository', () => {
  let repository: [Entidad]Repository;
  let model: Model<[Entidad]Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        [Entidad]Repository,
        {
          provide: getModelToken('[Entidad]'),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<[Entidad]Repository>([Entidad]Repository);
    model = module.get<Model<[Entidad]Document>>(getModelToken('[Entidad]'));
  });

  describe('create', () => {
    it('should create a new [entidad]', async () => {
      // Arrange
      const entity = createMock[Entidad]();
      const document = createMock[Entidad]Document();
      jest.spyOn(model, 'create').mockResolvedValue(document as any);

      // Act
      const result = await repository.create(entity);

      // Assert
      expect(model.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should return entity when found', async () => {
      // Arrange
      const id = 'test-id';
      const document = createMock[Entidad]Document();
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(document),
      } as any);

      // Act
      const result = await repository.findById(id);

      // Assert
      expect(model.findOne).toHaveBeenCalledWith({ id });
      expect(result).toBeDefined();
    });

    it('should return null when not found', async () => {
      // Arrange
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      // Act
      const result = await repository.findById('non-existent');

      // Assert
      expect(result).toBeNull();
    });
  });
});
```

### 12.4 Test de Use Cases

```typescript
// Create[Entidad]UseCase.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { Create[Entidad]UseCase } from '../../../src/andean/app/use_cases/[modulo]/Create[Entidad]UseCase';
import { [Entidad]Repository } from '../../../src/andean/app/datastore/[entidad].repo';

describe('Create[Entidad]UseCase', () => {
  let useCase: Create[Entidad]UseCase;
  let repository: jest.Mocked<[Entidad]Repository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      // ... otros métodos
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Create[Entidad]UseCase,
        {
          provide: [Entidad]Repository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<Create[Entidad]UseCase>(Create[Entidad]UseCase);
    repository = module.get([Entidad]Repository);
  });

  describe('execute', () => {
    it('should create [entidad] successfully', async () => {
      // Arrange
      const dto = createMockDto();
      const expectedEntity = createMock[Entidad]();
      repository.create.mockResolvedValue(expectedEntity);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(expectedEntity);
    });

    it('should throw error when validation fails', async () => {
      // Arrange
      const invalidDto = { ...createMockDto(), precio: -1 };

      // Act & Assert
      await expect(useCase.execute(invalidDto)).rejects.toThrow();
    });
  });
});
```

### 12.5 Test de Controladores

```typescript
// [entidad].controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { [Entidad]Controller } from '../../../src/andean/infra/controllers/[entidad].controller';
import { Create[Entidad]UseCase } from '../../../src/andean/app/use_cases/[modulo]/Create[Entidad]UseCase';

describe('[Entidad]Controller', () => {
  let controller: [Entidad]Controller;
  let create[Entidad]UseCase: jest.Mocked<Create[Entidad]UseCase>;

  beforeEach(async () => {
    const mockUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [[Entidad]Controller],
      providers: [
        {
          provide: Create[Entidad]UseCase,
          useValue: mockUseCase,
        },
        // ... otros use cases
      ],
    }).compile();

    controller = module.get<[Entidad]Controller>([Entidad]Controller);
    create[Entidad]UseCase = module.get(Create[Entidad]UseCase);
  });

  describe('create', () => {
    it('should create [entidad] and return response', async () => {
      // Arrange
      const dto = createMockDto();
      const entity = createMock[Entidad]();
      create[Entidad]UseCase.execute.mockResolvedValue(entity);

      // Act
      const result = await controller.create(dto);

      // Assert
      expect(create[Entidad]UseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toBeDefined();
      expect(result.id).toBe(entity.id);
    });
  });
});
```

---

## Paso 13: Agregar Tests de Integración

**Ubicación:** `test/integration/[modulo]/`

### 13.1 Test de API Endpoints

```typescript
// [entidad].e2e.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('[Entidad] API (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('POST /[entidades]', () => {
		it('should create a new [entidad]', () => {
			const dto = {
				campo1: 'valor1',
				campo2: 'valor2',
			};

			return request(app.getHttpServer())
				.post('/[entidades]')
				.send(dto)
				.expect(201)
				.expect((res) => {
					expect(res.body.id).toBeDefined();
					expect(res.body.campo1).toBe(dto.campo1);
				});
		});

		it('should return 400 for invalid data', () => {
			const invalidDto = {
				campo1: '', // invalid
			};

			return request(app.getHttpServer())
				.post('/[entidades]')
				.send(invalidDto)
				.expect(400);
		});
	});

	describe('GET /[entidades]/:id', () => {
		it('should return [entidad] by id', async () => {
			// First create
			const createRes = await request(app.getHttpServer())
				.post('/[entidades]')
				.send(createMockDto());

			const id = createRes.body.id;

			// Then get
			return request(app.getHttpServer())
				.get(`/[entidades]/${id}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.id).toBe(id);
				});
		});

		it('should return 404 for non-existent id', () => {
			return request(app.getHttpServer())
				.get('/[entidades]/non-existent-id')
				.expect(404);
		});
	});

	describe('GET /[entidades]', () => {
		it('should return list of [entidades]', () => {
			return request(app.getHttpServer())
				.get('/[entidades]')
				.expect(200)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
				});
		});

		it('should filter by categoryId', () => {
			const categoryId = 'test-category';

			return request(app.getHttpServer())
				.get(`/[entidades]?categoryId=${categoryId}`)
				.expect(200);
		});
	});

	describe('PUT /[entidades]/:id', () => {
		it('should update [entidad]', async () => {
			// Create
			const createRes = await request(app.getHttpServer())
				.post('/[entidades]')
				.send(createMockDto());

			const id = createRes.body.id;

			// Update
			const updateDto = {
				campo1: 'nuevo-valor',
			};

			return request(app.getHttpServer())
				.put(`/[entidades]/${id}`)
				.send(updateDto)
				.expect(200)
				.expect((res) => {
					expect(res.body.campo1).toBe(updateDto.campo1);
				});
		});
	});

	describe('DELETE /[entidades]/:id', () => {
		it('should delete [entidad]', async () => {
			// Create
			const createRes = await request(app.getHttpServer())
				.post('/[entidades]')
				.send(createMockDto());

			const id = createRes.body.id;

			// Delete
			await request(app.getHttpServer())
				.delete(`/[entidades]/${id}`)
				.expect(204);

			// Verify deleted
			return request(app.getHttpServer()).get(`/[entidades]/${id}`).expect(404);
		});
	});
});
```

---

## Paso 14: Documentación API

### 14.1 Swagger/OpenAPI

Ya configurado con decoradores en controladores:

```typescript
@ApiTags('[Entidades]')
@Controller('[entidades]')
export class [Entidad]Controller {
  @Post()
  @ApiOperation({ summary: 'Create a new [entidad]' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created',
    type: [Entidad]Response,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async create(@Body() dto: Create[Entidad]Dto) {
    // ...
  }
}
```

### 14.2 Generar Documentación

Acceder a: `http://localhost:3000/api/docs`

### 14.3 README del Módulo

Crear `README.md` en la carpeta del módulo:

```markdown
# [Entidad] Module

## Descripción

[Descripción del módulo y su propósito]

## Endpoints

### POST /[entidades]

Crear un nuevo [entidad]

**Request Body:**
\`\`\`json
{
"campo1": "valor1",
"campo2": "valor2"
}
\`\`\`

**Response:** 201 Created
\`\`\`json
{
"id": "uuid",
"campo1": "valor1",
"campo2": "valor2",
"createdAt": "2026-01-13T...",
"updatedAt": "2026-01-13T..."
}
\`\`\`

### GET /[entidades]/:id

Obtener [entidad] por ID

### GET /[entidades]

Listar [entidades] con filtros opcionales

### PUT /[entidades]/:id

Actualizar [entidad]

### DELETE /[entidades]/:id

Eliminar [entidad]

## Reglas de Negocio

1. [Regla 1]
2. [Regla 2]

## Validaciones

- Campo1 debe ser...
- Campo2 no puede ser...

## Estados

- PENDING: Estado inicial
- PUBLISHED: Producto publicado
- ...
```

---

## ✅ Checklist Final

### Implementación

- [ ] Repositorios creados y probados
- [ ] Use cases implementados
- [ ] Controladores REST funcionando
- [ ] Módulo NestJS registrado
- [ ] Validaciones de negocio completas

### Tests

- [ ] Tests unitarios de entidades (>80% coverage)
- [ ] Tests unitarios de mappers (100% coverage)
- [ ] Tests unitarios de repositorios (>80% coverage)
- [ ] Tests unitarios de use cases (>80% coverage)
- [ ] Tests unitarios de controladores (>80% coverage)
- [ ] Tests de integración E2E de API
- [ ] Tests de casos edge

### Documentación

- [ ] Swagger/OpenAPI completo
- [ ] README del módulo
- [ ] Comentarios en código complejo
- [ ] Diagramas de flujo (si necesario)

### Calidad

- [ ] Linter sin errores
- [ ] Type checking pasando
- [ ] No hay código duplicado
- [ ] Manejo de errores apropiado
- [ ] Logging implementado

---

## 📊 Métricas de Calidad

### Coverage de Tests

```bash
npm run test:cov
```

**Objetivos:**

- Entidades: 100%
- Mappers: 100%
- Repositorios: >80%
- Use Cases: >80%
- Controladores: >80%
- **Global: >80%**

### Análisis Estático

```bash
npm run lint
npm run type-check
```

---

## 🔧 Scripts útiles

```json
{
	"scripts": {
		"test": "jest",
		"test:watch": "jest --watch",
		"test:cov": "jest --coverage",
		"test:e2e": "jest --config ./test/jest-e2e.json",
		"lint": "eslint \"{src,test}/**/*.ts\"",
		"lint:fix": "eslint \"{src,test}/**/*.ts\" --fix"
	}
}
```

---

## 📚 Referencias

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest](https://github.com/visionmedia/supertest)
- [Clean Architecture Testing](https://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html)

---

**Fecha de creación:** Enero 2026  
**Basado en:** Implementación completa de Superfoods Module
