# Reglas de Arquitectura - Manejo de IDs

## Regla: Manejo Unificado de IDs con ObjectId

### Principio General

En este proyecto, utilizamos **un solo identificador** que será `ObjectId` de MongoDB. La transición entre `id` (string) y `_id` (ObjectId) se maneja exclusivamente en los **Mappers**.

### Reglas Específicas

#### 1. Schemas de MongoDB

**Los schemas NO deben incluir el campo `id` explícitamente.**

- MongoDB genera automáticamente el campo `_id` como `ObjectId`
- No se debe definir `id` en el schema
- El schema solo debe tener los campos de dominio, sin `id`

**Ejemplo CORRECTO:**
```typescript
export const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // NO incluir: id: { type: String }
});
```

**Ejemplo INCORRECTO:**
```typescript
export const ProductSchema = new Schema({
  id: { type: String, required: true }, // ❌ NO hacer esto
  name: { type: String, required: true },
  // ...
});
```

#### 2. Entidades de Dominio

**Las entidades de dominio SÍ deben tener el campo `id: string`.**

- El campo `id` es de tipo `string` (representación del ObjectId)
- Se usa en toda la lógica de negocio
- Es parte del constructor de la entidad

**Ejemplo:**
```typescript
export class Product {
  constructor(
    public id: string, // ✅ String, no ObjectId
    public name: string,
    public price: number,
    // ...
  ) {}
}
```

#### 3. Mappers - Responsabilidad de Conversión

**Los Mappers son los ÚNICOS responsables de convertir entre `id` y `_id`.**

##### `fromDocument` (Document → Entidad)

- **Input:** `Document` con `_id: ObjectId`
- **Output:** Entidad con `id: string`
- **Conversión:** `_id.toString()` → `id`

**Ejemplo:**
```typescript
static fromDocument(doc: ProductDocument): Product {
  const plain = doc.toObject();
  const { _id, ...rest } = plain;
  
  return plainToInstance(Product, {
    id: _id.toString(), // ✅ Convertir ObjectId a string
    ...rest,
  });
}
```

##### `toPersistence` (Entidad → Document)

- **Input:** Entidad con `id: string`
- **Output:** Objeto plano sin `id` (MongoDB usará `_id` automáticamente)
- **Conversión:** Excluir `id` del objeto (y también `_id`, `__v` si existen)

**Ejemplo:**
```typescript
static toPersistence(product: Product) {
  const plain = instanceToPlain(product);
  const { id, _id, __v, ...dataForDB } = plain; // ✅ Excluir id, _id, __v
  
  return dataForDB; // MongoDB asignará _id automáticamente
}
```

##### `fromCreateDto` / `fromUpdateDto`

- **Input:** DTO (puede tener `id` opcional)
- **Output:** Entidad con `id: string`
- **Nota:** Si el DTO no tiene `id`, se genera uno nuevo (para create) o se usa el existente (para update)

**Ejemplo:**
```typescript
static fromCreateDto(dto: CreateProductDto): Product {
  const plain = {
    id: crypto.randomUUID(), // ✅ Generar nuevo ID si es creación
    ...dto,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  return plainToInstance(Product, plain);
}

static fromUpdateDto(id: string, dto: UpdateProductDto): Product {
  const plain = {
    id: id, // ✅ Usar el ID proporcionado
    ...dto,
    updatedAt: new Date(),
  };
  
  return plainToInstance(Product, plain);
}
```

### Flujo de Datos

```
┌─────────────────┐
│   HTTP Request  │
│   (DTO con id?) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Use Case      │
│   (Entidad)     │
│   id: string    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│    Mapper       │─────▶│  MongoDB         │
│  toPersistence  │      │  Document        │
│  (excluye id)   │      │  _id: ObjectId   │
└─────────────────┘      └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │    Mapper        │
                          │  fromDocument    │
                          │  (id = _id.toString())│
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │   Use Case       │
                          │   (Entidad)      │
                          │   id: string     │
                          └──────────────────┘
```

### Casos Especiales

#### Cuando se necesita ObjectId para queries

Si necesitas hacer queries con ObjectId, usa `MongoIdUtils`:

```typescript
import { MongoIdUtils } from '../utils/MongoIdUtils';

// Convertir string a ObjectId para queries
const objectId = MongoIdUtils.stringToObjectId(id);
const doc = await this.model.findById(objectId).exec();
```

#### Cuando se actualiza un documento existente

Al actualizar, MongoDB preserva el `_id` original. El mapper debe excluir `id` y `_id`:

```typescript
static toPersistence(product: Product) {
  const plain = instanceToPlain(product);
  const { id, _id, __v, createdAt, ...updateData } = plain;
  // Excluir createdAt también si no quieres actualizarlo
  
  return updateData; // MongoDB preservará el _id original
}
```

### Resumen de Reglas

| Ubicación | Campo ID | Tipo | Generación |
|-----------|----------|------|------------|
| **Schema** | ❌ NO incluir | - | MongoDB genera `_id` automáticamente |
| **Entidad de Dominio** | ✅ `id` | `string` | Se asigna en el constructor |
| **Document (MongoDB)** | ✅ `_id` | `ObjectId` | Generado automáticamente por MongoDB |
| **Mapper fromDocument** | Convierte `_id` → `id` | `ObjectId.toString()` | - |
| **Mapper toPersistence** | Excluye `id` | - | MongoDB asigna `_id` |

### Beneficios

1. **Consistencia:** Un solo identificador en toda la aplicación
2. **Separación de responsabilidades:** Los mappers manejan la conversión
3. **Simplicidad:** Los schemas no necesitan definir `id`
4. **Flexibilidad:** Fácil migración entre diferentes tipos de IDs si es necesario

## Regla: Manejo de Updates con Partial<>

### Principio General

Para facilitar las actualizaciones parciales de entidades, utilizamos `Partial<>` en los métodos de update tanto en los **Use Cases** como en los **Repositorios**. Esto permite actualizar solo los campos que se proporcionan en el DTO, sin necesidad de enviar toda la entidad.

### Reglas Específicas

#### 1. DTOs de Update

**Los DTOs de Update deben extender `PartialType` del DTO de Create.**

- Todos los campos del DTO de Create se vuelven opcionales
- Usa `PartialType` de `@nestjs/swagger` para mantener la documentación de Swagger

**Ejemplo:**
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './CreateProductDto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

#### 2. Repositorio Abstracto

**El método `update` en el repositorio abstracto debe aceptar `Partial<Entity>`.**

**Ejemplo:**
```typescript
export abstract class ProductRepository {
  abstract update(id: string, product: Partial<Product>): Promise<Product>;
  // ...
}
```

#### 3. Implementación del Repositorio

**La implementación del repositorio debe:**
- Aceptar `Partial<Entity>` en el método `update`
- Usar `Mapper.toPersistence()` que debe aceptar `Partial<Entity>`
- Pasar el objeto directamente a MongoDB (que actualizará solo los campos proporcionados)

**Ejemplo:**
```typescript
async update(id: string, product: Partial<Product>): Promise<Product> {
  const plain = ProductMapper.toPersistence(product); // ✅ Acepta Partial<Product>
  const objectId = MongoIdUtils.stringToObjectId(id);
  const updated = await this.productModel
    .findByIdAndUpdate(objectId, plain, { new: true })
    .exec();
  return ProductMapper.fromDocument(updated!);
}
```

#### 4. Mapper - toPersistence

**El método `toPersistence` debe aceptar tanto `Entity` como `Partial<Entity>`.**

- Esto permite usar el mismo método para create (entidad completa) y update (entidad parcial)
- Siempre excluir `id`, `_id`, `__v` independientemente de si es parcial o completo

**Ejemplo:**
```typescript
static toPersistence(product: Product | Partial<Product>) {
  const plain = instanceToPlain(product);
  const { id, _id, __v, ...dataForDB } = plain; // ✅ Excluir siempre
  
  return dataForDB;
}
```

#### 5. Use Case de Update

**El Use Case debe:**
1. Obtener la entidad existente
2. Combinar la entidad existente con el DTO usando spread operator
3. Pasar `Partial<Entity>` al repositorio

**Ejemplo:**
```typescript
async handle(id: string, dto: UpdateProductDto): Promise<Product> {
  // 1. Validar que existe
  const productFound = await this.productRepository.getById(id);
  if (!productFound) {
    throw new NotFoundException('Product not found');
  }

  // 2. Validaciones específicas del DTO (si aplica)
  if (dto.categoryId) {
    const category = await this.categoryRepository.getById(dto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  // 3. Combinar entidad existente con DTO
  const updatedData: Partial<Product> = {
    ...productFound, // ✅ Entidad completa existente
    ...dto,          // ✅ Solo campos del DTO (sobrescribe los del found)
  };

  // 4. Actualizar
  return await this.productRepository.update(id, updatedData);
}
```

### Flujo de Update

```
┌─────────────────┐
│   HTTP Request  │
│  UpdateProductDto│
│  (campos parciales)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  UpdateUseCase  │
│  1. getById     │
│  2. merge       │
│  3. validaciones│
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│  Repository     │─────▶│  MongoDB         │
│  update(id,     │      │  findByIdAndUpdate│
│   Partial<>)    │      │  (solo campos    │
│                 │      │   proporcionados)│
└─────────────────┘      └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │    Mapper        │
                          │  fromDocument    │
                          │  (entidad completa)│
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │   Use Case       │
                          │   (retorna)      │
                          └──────────────────┘
```

### Ventajas de usar Partial<>

1. **Flexibilidad:** Actualizar solo los campos necesarios
2. **Simplicidad:** No necesitas construir la entidad completa en el Use Case
3. **Type Safety:** TypeScript valida que solo uses campos de la entidad
4. **MongoDB:** Actualiza solo los campos proporcionados automáticamente

### Ejemplos de Violaciones

❌ **NO hacer esto:**
```typescript
// Repositorio que requiere entidad completa
abstract update(id: string, product: Product): Promise<Product>; // ❌

// Use Case que construye entidad completa innecesariamente
const updated = ProductMapper.fromUpdateDto(id, dto); // ❌ Construye entidad completa
return await this.repository.update(id, updated);

// Mapper que no acepta Partial
static toPersistence(product: Product) { // ❌ Solo acepta Product completo
  // ...
}
```

✅ **Hacer esto:**
```typescript
// Repositorio que acepta Partial
abstract update(id: string, product: Partial<Product>): Promise<Product>; // ✅

// Use Case que combina existente con DTO
const updatedData: Partial<Product> = {
  ...productFound,
  ...dto,
}; // ✅ Solo campos que cambian
return await this.repository.update(id, updatedData);

// Mapper que acepta Partial
static toPersistence(product: Product | Partial<Product>) { // ✅
  // ...
}
```

### Resumen de Reglas de Update

| Componente | Tipo de Parámetro | Propósito |
|------------|-------------------|-----------|
| **UpdateDto** | `PartialType(CreateDto)` | Todos los campos opcionales |
| **Repository.update** | `Partial<Entity>` | Acepta actualización parcial |
| **Mapper.toPersistence** | `Entity \| Partial<Entity>` | Maneja ambos casos |
| **Use Case** | Construye `Partial<Entity>` | Combina existente + DTO |

### Ejemplos de Violaciones

❌ **NO hacer esto:**
```typescript
// Schema con id explícito
export const ProductSchema = new Schema({
  id: { type: String, required: true }, // ❌
  // ...
});

// Mapper que incluye id en toPersistence
static toPersistence(product: Product) {
  return {
    id: product.id, // ❌ NO incluir id
    name: product.name,
  };
}

// Document que tiene id y _id
const doc = {
  _id: new ObjectId(),
  id: "some-string", // ❌ No debería tener ambos
};
```

✅ **Hacer esto:**
```typescript
// Schema sin id
export const ProductSchema = new Schema({
  name: { type: String, required: true }, // ✅
  // MongoDB genera _id automáticamente
});

// Mapper que excluye id
static toPersistence(product: Product) {
  const { id, ...data } = instanceToPlain(product); // ✅
  return data;
}
```
