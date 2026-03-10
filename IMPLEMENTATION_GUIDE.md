# Guía de Implementación de Nuevos Módulos/Endpoints

## 📖 Resumen

Esta guía proporciona una metodología sistemática para implementar nuevos módulos, entidades y endpoints en el proyecto Andean Marketplace API, siguiendo principios de Clean Architecture y mejores prácticas de NestJS.

---

## 🎯 Principios de Arquitectura

### Estructura de Capas

```
domain/          → Entidades de negocio, enums, interfaces (independiente de frameworks)
├── entities/    → Modelos de dominio puros
├── enums/       → Enumeraciones de valores permitidos
└── interfaces/  → Contratos y abstracciones

infra/           → Implementaciones concretas y detalles técnicos
├── persistence/ → Schemas de base de datos (MongoDB/Mongoose)
├── services/    → Mappers, servicios externos
└── controllers/ → Controladores REST y DTOs

app/             → Lógica de aplicación
├── use_cases/   → Casos de uso (orquestación)
├── modules/     → Respuestas y módulos de aplicación
└── datastore/   → Repositorios (acceso a datos)
```

### Principios Clave

1. **Independencia del Dominio**: Las entidades no deben depender de frameworks
2. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad clara
3. **Inyección de Dependencias**: Usar interfaces para desacoplar
4. **Validación en Capas**:
   - **DTOs**: Validaciones de formato, rangos numéricos, longitudes, tipos de datos (usando `class-validator`)
   - **Use Cases**: Validaciones de existencia de entidades, permisos, reglas de negocio complejas
   - **Entidades**: Invariantes del dominio (opcional, solo si son críticas)

---

## 📋 Metodología de Implementación

### Fase 1: Análisis y Diseño

#### 1.1 Identificar Entidades y Relaciones

**Preguntas clave:**

- ¿Cuál es la entidad principal?
- ¿Qué entidades embebidas necesita? (nested)
- ¿Qué entidades deben ser colecciones separadas? (referencias)
- ¿Qué enumeraciones son necesarias?

**Criterios de decisión:**

| Tipo                  | Usar cuando                                                              | Ejemplo                                  |
| --------------------- | ------------------------------------------------------------------------ | ---------------------------------------- |
| **Embebido (nested)** | Datos específicos de la entidad, no reutilizables, siempre cargan juntos | BasicInfo, DetailProduct, PriceInventory |
| **Referencia (FK)**   | Datos compartidos, catálogos, pueden existir independientemente          | Categories, Types, Certifications        |
| **Enum**              | Valores fijos y limitados, no cambiarán frecuentemente                   | Status, ConsumptionWay, ProductionMethod |

#### 1.2 Diseñar el Modelo de Datos

**Crear diagrama de relaciones:**

```
SuperfoodProduct (Principal - Borde Amarillo)
├── SuperfoodBasicInfo (Embebido - Borde Azul)
├── SuperfoodDetailProduct (Embebido - Borde Azul)
├── SuperfoodPriceInventory (Embebido - Borde Azul)
├── NutritionalItems[] (Embebido - Borde Azul)
└── → SuperfoodCategory (Referencia - Borde Verde)
    → SuperfoodType (Referencia - Borde Verde)
    → MediaItems (Referencia - Borde Verde)
```

#### 1.3 Definir Estructura de Carpetas

```
src/andean/
├── domain/
│   ├── entities/
│   │   ├── [nombre-modulo]/              # Si tiene 2+ archivos relacionados
│   │   │   ├── [EntidadPrincipal].ts
│   │   │   ├── [EntidadNested1].ts
│   │   │   └── [EntidadNested2].ts
│   │   └── [EntidadSimple].ts           # Si es solo 1 archivo
│   └── enums/
│       ├── [Enum1].ts
│       └── [Enum2].ts
│
├── infra/
│   ├── persistence/
│   │   ├── [entidad-principal].schema.ts
│   │   ├── [entidad-referencia1].schema.ts
│   │   └── [entidad-referencia2].schema.ts
│   │
│   ├── services/
│   │   ├── [EntidadPrincipal]Mapper.ts
│   │   └── [EntidadNested]Mapper.ts (si es complejo)
│   │
│   └── controllers/
│       └── dto/[nombre-modulo]/
│           ├── Create[Entidad]Dto.ts
│           ├── Update[Entidad]Dto.ts
│           └── [Nested]Dtos...
│
└── app/
    ├── modules/
    │   └── [Entidad]Response.ts
    ├── datastore/
    │   └── [entidad].repo.ts
    └── use_cases/
        └── [modulo]/
            ├── Create[Entidad]UseCase.ts
            ├── Update[Entidad]UseCase.ts
            └── Get[Entidad]UseCase.ts
```

**Nota sobre convención de nombres:**

- Clase abstracta del repositorio: `[entidad].repo.ts`
- Implementación del repositorio: `[entidad].repo.impl.ts` (en `infra/datastore/`)

**Nota sobre organización de carpetas:**

- **2+ archivos relacionados**: Crear carpeta con nombre del módulo
  - Ejemplo: `entities/superfoods/` contiene `SuperfoodProduct.ts`, `SuperfoodBasicInfo.ts`, etc.
- **1 archivo único**: Colocar directamente en la carpeta padre
  - Ejemplo: `entities/Account.ts`, `entities/Shop.ts`
- **Criterio**: Si la entidad tiene sub-entidades o componentes nested, usar carpeta

---

## 🔨 Proceso de Implementación

### Paso 1: Crear Enumeraciones

**Ubicación:** `src/andean/domain/enums/`

**Cuándo crear un enum:**

- Valores fijos conocidos de antemano
- Lista cerrada de opciones
- Representa estados o tipos

**Plantilla:**

```typescript
export enum [NombreEnum] {
  VALOR_1 = 'VALOR_1',
  VALOR_2 = 'VALOR_2',
  VALOR_3 = 'VALOR_3',
}
```

**Ejemplo:**

```typescript
// SuperfoodProductStatus.ts
export enum SuperfoodProductStatus {
	PUBLISHED = 'PUBLISHED',
	PENDING = 'PENDING',
	SOLD_OUT = 'SOLD_OUT',
	HIDDEN = 'HIDDEN',
}
```

---

### Paso 2: Crear Entidades de Dominio

**Ubicación:** `src/andean/domain/entities/[nombre-modulo]/`

**Orden de creación:**

1. Entidades más simples (sin dependencias)
2. Entidades anidadas
3. Entidad principal

**Principios:**

- Usar clases TypeScript puras (no decoradores de frameworks)
- Constructor con todos los campos requeridos
- Campos opcionales con `?`
- Sin lógica de negocio compleja (eso va en use cases)

**Plantilla:**

```typescript
export class [NombreEntidad] {
  constructor(
    public id: string,
    public campo1: string,
    public campo2: number,
    public campoOpcional?: string,
  ) {}
}
```

**Ejemplo:**

```typescript
// SuperfoodBasicInfo.ts
export class SuperfoodBasicInfo {
	constructor(
		public title: string,
		public mediaIds: string[],
		public description: string,
		public general_features: string[],
		public nutritional_features: string[],
		public benefits: string[],
		public ownerType: SuperfoodOwnerType,
		public ownerId: string,
	) {}
}
```

---

### Paso 3: Crear Schemas de Persistencia

**Ubicación:** `src/andean/infra/persistence/`

**Orden de creación:**

1. Schemas de colecciones separadas (referencias)
2. Schemas anidados (nested)
3. Schema principal

#### 3.1 Colecciones Separadas

**Cuándo usar:**

- Catálogos reutilizables
- Entidades que pueden existir independientemente
- Datos que se referencian desde múltiples lugares

**Plantilla:**

```typescript
import { Document, Schema } from 'mongoose';

export const [Nombre]Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // ... otros campos
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface [Nombre]Document extends Document {
  id: string;
  name: string;
  // ... otros campos
  createdAt: Date;
  updatedAt: Date;
}
```

#### 3.2 Schemas Anidados

**Cuándo usar:**

- Datos específicos de la entidad principal
- No se reutilizan en otros contextos
- Siempre se cargan junto con la entidad principal

**Plantilla:**

```typescript
const [Nombre]NestedSchema = new Schema({
  campo1: { type: String, required: true },
  campo2: { type: Number, required: true },
  campoOpcional: { type: String },
}, { _id: false }); // Sin _id propio
```

#### 3.3 Schema Principal

**Componentes:**

- Campos propios
- Schemas anidados embebidos
- Referencias a otras colecciones (IDs)
- Timestamps

**Plantilla:**

```typescript
export const [Entidad]Schema = new Schema({
  id: { type: String, required: true, unique: true },
  categoriaId: { type: String, required: true }, // FK
  status: {
    type: String,
    enum: Object.values([Enum]),
    required: true
  },
  datosBasicos: { type: [DatosBasicos]Schema, required: true },
  datosAnidados: { type: [DatosAnidados]Schema, required: true },
  listaItems: { type: [[Item]Schema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

---

### Paso 4: Crear DTOs (Data Transfer Objects)

**Ubicación:** `src/andean/infra/controllers/dto/[nombre-modulo]/`

**Propósito:**

- **Validar datos de entrada** (PRINCIPAL: validaciones de formato, rangos, tipos)
- Documentar API con Swagger
- Separar modelo de dominio de API

**🎯 Principio Clave:** Todas las validaciones simples (precios > 0, stocks >= 0, longitudes, tipos) DEBEN ir en los DTOs usando decoradores de `class-validator`. NO en los use cases.

**Decoradores comunes:**

```typescript
// Validación de tipos
@IsString(), @IsNumber(), @IsBoolean()
@IsArray(), @IsObject()
@IsEnum(EnumType)

// Validación de presencia
@IsNotEmpty(), @IsOptional()

// Validación de rangos y longitudes
@Min(valor), @Max(valor)
@MinLength(n), @MaxLength(n)

// Validación de objetos anidados
@ValidateNested(), @Type(() => ClaseDto)

// Documentación Swagger
@ApiProperty({
  description: '...',
  example: '...',
  minimum: 0,  // Documenta también en Swagger
  maximum: 100
})
```

**Ejemplos prácticos:**

```typescript
// ✅ Precio siempre mayor a 0
@ApiProperty({ description: 'Precio base del producto', minimum: 0.01 })
@IsNumber()
@Min(0.01, { message: 'Base price must be greater than 0' })
basePrice: number;

// ✅ Stock no negativo
@ApiProperty({ description: 'Stock total', minimum: 0 })
@IsNumber()
@Min(0, { message: 'Stock cannot be negative' })
totalStock: number;

// ✅ Texto con longitud específica
@ApiProperty({ minLength: 3, maxLength: 100 })
@IsString()
@MinLength(3)
@MaxLength(100)
title: string;
```

#### 4.1 DTOs Anidados

**Crear primero los DTOs de entidades anidadas:**

```typescript
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create[Nested]Dto {
  @ApiProperty({ description: 'Descripción', example: 'Ejemplo' })
  @IsString()
  @IsNotEmpty()
  campo: string;
}
```

#### 4.2 DTO Principal

```typescript
import { IsArray, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class Create[Entidad]Dto {
  @ApiProperty({ description: 'ID de categoría' })
  @IsString()
  @IsNotEmpty()
  categoriaId: string;

  @ApiProperty({ enum: [Enum] })
  @IsEnum([Enum])
  status: [Enum];

  @ApiProperty({ type: Create[Nested]Dto })
  @ValidateNested()
  @Type(() => Create[Nested]Dto)
  datosNested: Create[Nested]Dto;

  @ApiProperty({ type: [Create[Item]Dto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Create[Item]Dto)
  items: Create[Item]Dto[];
}
```

#### 4.3 Custom Validators (para lógica compleja)

**Ubicación:** `src/andean/infra/validators/`

**Cuándo crear:**

- Validaciones que requieren lógica más allá de decoradores simples
- Validaciones que involucran múltiples campos
- Reglas específicas del dominio

**Plantilla:**

```typescript
import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customValidator', async: false })
export class CustomValidatorConstraint implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
		// Lógica de validación
		return true; // o false
	}

	defaultMessage(args: ValidationArguments) {
		return 'Validation failed';
	}
}

export function CustomValidator(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: CustomValidatorConstraint,
		});
	};
}
```

**Ejemplo real:**

```typescript
// UniqueVariantCombinations.validator.ts
@ValidatorConstraint({ name: 'uniqueVariantCombinations', async: false })
export class UniqueVariantCombinationsConstraint implements ValidatorConstraintInterface {
  validate(variants: any[], args: ValidationArguments) {
    if (!variants || variants.length === 0) return true;

    const combinations = variants.map(v => JSON.stringify(v.combination));
    const uniqueCombinations = new Set(combinations);

    return combinations.length === uniqueCombinations.size;
  }

  defaultMessage(args: ValidationArguments) {
    return 'There are variants with duplicate combinations';
  }
}

// Uso en DTO
@UniqueVariantCombinations()
variants?: CreateSuperfoodVariantDto[];
```

#### 4.4 Update DTO

```typescript
import { PartialType } from '@nestjs/swagger';
import { Create[Entidad]Dto } from './Create[Entidad]Dto';

export class Update[Entidad]Dto extends PartialType(Create[Entidad]Dto) {}
```

**Nota:** El `PartialType` hace que todos los campos sean opcionales y hereda todas las validaciones del DTO de creación.

---

### Paso 5: Crear Mappers

**Ubicación:** `src/andean/infra/services/`

**Propósito:**

- Convertir entre Document (MongoDB) ↔ Entity (Domain)
- Convertir entre DTO (API) → Entity (Domain)
- **Centralizar la construcción de entidades** (evitar duplicación en use cases)

**🎯 Principio Clave:** Los use cases NO deben construir entidades directamente. Siempre usar mappers para transformar DTOs en entidades de dominio.

**Plantilla:**

```typescript
import { [Entidad] } from '../../domain/entities/[modulo]/[Entidad]';
import { [Entidad]Document } from '../persistence/[entidad].schema';
import { Create[Entidad]Dto } from '../controllers/dto/[modulo]/Create[Entidad]Dto';
import { Update[Entidad]Dto } from '../controllers/dto/[modulo]/Update[Entidad]Dto';
import * as crypto from 'crypto';

export class [Entidad]Mapper {
  // Document → Entity
  static fromDocument(doc: [Entidad]Document): [Entidad] {
    return new [Entidad](
      doc.id,
      doc.campo1,
      doc.campo2,
      // Mapear entidades anidadas
      this.mapNestedEntity(doc.nested),
      doc.createdAt,
      doc.updatedAt,
    );
  }

  // CreateDTO → Entity (IMPORTANTE: usar en create use cases)
  static fromCreateDto(dto: Create[Entidad]Dto): [Entidad] {
    return new [Entidad](
      crypto.randomUUID(),
      dto.campo1,
      dto.campo2,
      this.mapNestedFromDto(dto.nested),
      new Date(),
      new Date(),
    );
  }

  // UpdateDTO → Entity (IMPORTANTE: usar en update use cases)
  static fromUpdateDto(dto: Update[Entidad]Dto, existing: [Entidad]): [Entidad] {
    return new [Entidad](
      existing.id,
      dto.campo1 ?? existing.campo1,
      dto.campo2 ?? existing.campo2,
      dto.nested ? this.mapNestedFromDto(dto.nested) : existing.nested,
      existing.createdAt,
      new Date(),
    );
  }

  // DTO → Document (para persistencia directa - opcional)
  static toDocument(dto: Create[Entidad]Dto): Partial<[Entidad]Document> {
    return {
      id: crypto.randomUUID(),
      campo1: dto.campo1,
      campo2: dto.campo2,
      nested: this.mapNestedToDocument(dto.nested),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Helpers para entidades anidadas
  private static mapNestedEntity(doc: any): [NestedEntity] {
    return new [NestedEntity](
      doc.campo1,
      doc.campo2,
    );
  }

  private static mapNestedFromDto(dto: any): [NestedEntity] {
    return new [NestedEntity](
      dto.campo1,
      dto.campo2,
    );
  }
}
```

**Métodos principales del Mapper:**

| Método            | Uso                         | Cuándo usar                     |
| ----------------- | --------------------------- | ------------------------------- |
| `fromDocument()`  | Document → Entity           | Leer de BD en repositorios      |
| `fromCreateDto()` | CreateDTO → Entity          | **Use case de creación**        |
| `fromUpdateDto()` | UpdateDTO + Entity → Entity | **Use case de actualización**   |
| `toDocument()`    | DTO → Document              | Persistencia directa (opcional) |

**✅ Ventajas:**

- Elimina duplicación de código de construcción de entidades
- Centraliza lógica de mapeo en un solo lugar
- Facilita mantenimiento (un cambio en un lugar)
- Use cases más limpios y enfocados en lógica de negocio

---

### Paso 6: Crear Response Models

**Ubicación:** `src/andean/app/modules/`

**Propósito:**

- Documentar estructura de respuestas de API
- Consistencia en respuestas

**Plantilla:**

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class [Nested]Response {
  @ApiProperty()
  campo1: string;

  @ApiProperty()
  campo2: number;
}

export class [Entidad]Response {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: [Enum] })
  status: [Enum];

  @ApiProperty({ type: [Nested]Response })
  nested: [Nested]Response;

  @ApiProperty({ type: [[Item]Response] })
  items: [Item]Response[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
```

---

## 🎨 Convenciones y Estándares

### Nomenclatura

| Tipo                | Convención                      | Ejemplo                                     |
| ------------------- | ------------------------------- | ------------------------------------------- |
| **Archivos**        | camelCase.ts / PascalCase.ts    | `superfood.schema.ts`, `SuperfoodMapper.ts` |
| **Clases**          | PascalCase                      | `SuperfoodProduct`, `CreateSuperfoodDto`    |
| **Interfaces**      | PascalCase + Document/Interface | `SuperfoodDocument`, `IRepository`          |
| **Enums**           | PascalCase                      | `SuperfoodProductStatus`                    |
| **Valores de Enum** | UPPER_SNAKE_CASE                | `PUBLISHED`, `SOLD_OUT`                     |
| **Variables**       | camelCase                       | `superfoodId`, `basePrice`                  |

### Estructura de Imports

```typescript
// 1. Imports de Node/externos
import { Document, Schema } from 'mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

// 2. Imports de dominio
import { SuperfoodProduct } from '../../domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodProductStatus } from '../../domain/enums/SuperfoodProductStatus';

// 3. Imports de infra/app
import { SuperfoodProductDocument } from '../persistence/superfood.schema';
```

### Validación

**Regla Principal: Las validaciones simples van en DTOs**

**DTOs (PREFERIDO para validaciones simples):**

- Usar decoradores de `class-validator`:
  - `@IsNotEmpty()`, `@IsOptional()` - campos requeridos/opcionales
  - `@IsString()`, `@IsNumber()`, `@IsBoolean()` - tipos de datos
  - `@Min()`, `@Max()` - rangos numéricos
  - `@MinLength()`, `@MaxLength()` - longitudes de strings
  - `@IsEnum()` - valores permitidos
  - `@ValidateNested()` + `@Type()` - objetos anidados
  - Custom validators para lógica específica (ej: combinaciones únicas)

**Ejemplos:**

```typescript
// ✅ CORRECTO: Validación en DTO
@Min(0.01, { message: 'Base price must be greater than 0' })
basePrice: number;

@Min(0, { message: 'Stock cannot be negative' })
totalStock: number;
```

**Use Cases (solo para validaciones complejas):**

- Verificar existencia de entidades relacionadas
- Validar permisos y autorización
- Reglas de negocio que requieren consultas a BD
- Transiciones de estado

**Entidades de Dominio:**

- Sin validaciones (son objetos de datos puros)
- Constructor acepta valores sin validar

---

## 🔍 Checklist de Implementación

Usa este checklist para asegurar completitud:

### ✅ Fase 1: Modelo de Datos

- [ ] Enums definidos
- [ ] Entidades de dominio creadas
- [ ] Relaciones identificadas (embebido vs referencia)

### ✅ Fase 2: Persistencia

- [ ] Schemas de colecciones separadas
- [ ] Schema principal con nested schemas
- [ ] Interfaces Document definidas

### ✅ Fase 3: API

- [ ] DTOs de creación
- [ ] DTOs de actualización
- [ ] Response models
- [ ] Decoradores Swagger completos

### ✅ Fase 4: Transformación

- [ ] Mappers implementados con todos los métodos:
  - [ ] `fromDocument()` - Document → Entity
  - [ ] `fromCreateDto()` - CreateDTO → Entity
  - [ ] `fromUpdateDto()` - UpdateDTO + Entity → Entity
  - [ ] `toDocument()` - DTO → Document (opcional)
- [ ] Use cases usan mappers (NO construyen entidades directamente)
- [ ] Lógica de mapeo centralizada (sin duplicación)

---

## 🎯 Próximos Pasos

Después de completar estas fases base, continuar con:

1. **Repositorios** - Acceso a datos
2. **Use Cases** - Lógica de negocio
3. **Controladores** - Endpoints REST
4. **Módulo NestJS** - Registro de providers
5. **Tests** - Unitarios e integración
6. **Documentación** - Swagger/OpenAPI

Ver [IMPLEMENTATION_STEPS.md](./IMPLEMENTATION_STEPS.md) para detalles de estas fases.

---

## 📚 Recursos

- [NestJS Documentation](https://docs.nestjs.com/)
- [Mongoose Schemas](https://mongoosejs.com/docs/guide.html)
- [Class Validator](https://github.com/typestack/class-validator)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Fecha de creación:** Enero 2026  
**Basado en:** Implementación de Superfoods Module
