# Guía de Testing - Community Module

## Problema Encontrado

### ❌ Error en Test E2E

El test E2E fallaba con el siguiente error:

```
Nest can't resolve dependencies of the CommunityModel (?).
Please make sure that the argument "DatabaseConnection" at index [0]
is available in the MongooseModule context.
```

### 🔍 Análisis del Problema

**Test Unitario (✅ Pasaba):**

- No importaba el módulo completo
- Mockeaba directamente los use cases en el constructor del controlador
- No tenía dependencias de base de datos

**Test E2E (❌ Fallaba):**

- Intentaba importar `CommunityModule` completo
- El módulo incluye `MongooseModule.forFeature()` con esquemas
- Mongoose necesita conexión a MongoDB
- No había conexión a base de datos disponible en el entorno de testing

## Solución Implementada

### Enfoque Original (Incorrecto)

```typescript
// ❌ Esto intenta cargar toda la infraestructura incluyendo MongoDB
const moduleFixture = await Test.createTestingModule({
	imports: [CommunityModule], // Incluye Mongoose, schemas, etc.
})
	.overrideProvider(CommunityRepository)
	.useValue(mockRepository)
	.compile();
```

**Problema:** Aunque se overridea el repository, Mongoose aún intenta resolver sus dependencias (DatabaseConnection, schemas, etc.).

### Enfoque Correcto (Implementado)

```typescript
// ✅ Solo carga el controlador y mockea sus dependencias directas
const moduleFixture = await Test.createTestingModule({
	controllers: [CommunityController],
	providers: [
		{
			provide: CreateCommunityUseCase,
			useValue: { execute: jest.fn() },
		},
		// ... otros use cases mockeados
	],
}).compile();
```

**Ventajas:**

- No carga dependencias de infraestructura (MongoDB, Mongoose)
- Tests más rápidos (no hay overhead de base de datos)
- Tests más aislados y predecibles
- No requiere configuración de base de datos de prueba

## Diferencias entre Test Unitario y E2E

### Test Unitario (`community.controller.spec.ts`)

- **Objetivo:** Probar la lógica del controlador de forma aislada
- **Alcance:** Solo el controlador y sus dependencias directas
- **Mocks:** Use cases
- **No prueba:** Integración HTTP real, validación de pipes, etc.

### Test E2E (`community.e2e-spec.ts`)

- **Objetivo:** Probar endpoints HTTP reales
- **Alcance:** Flujo HTTP completo (request → pipes → controller → response)
- **Mocks:** Use cases (pero mantiene validaciones HTTP)
- **Prueba:** Validación real de DTOs, status codes HTTP, estructura de respuestas

## Comandos de Testing

```bash
# Test unitario específico
pnpm test src/andean/infra/controllers/community.controller.spec.ts

# Todos los tests E2E
pnpm test:e2e

# Test con coverage
pnpm test:cov

# Test en modo watch
pnpm test:watch
```

## Mejores Prácticas

### ✅ DO (Hacer)

1. **En tests E2E sin base de datos real:**
   - Mockear use cases en vez de importar módulos completos
   - Probar comportamiento HTTP (status codes, validaciones)
   - Mantener tests rápidos y sin dependencias externas

2. **En tests de integración (con DB):**
   - Usar base de datos de prueba (MongoDB Memory Server)
   - Importar módulos completos para pruebas reales
   - Limpiar datos entre tests

### ❌ DON'T (No hacer)

1. No importar módulos completos en tests E2E a menos que uses DB de prueba
2. No mezclar concerns: tests unitarios deben ser rápidos, E2E pueden ser más lentos
3. No depender de orden de ejecución de tests

## Estructura de Tests Recomendada

```
test/
├── unit/                          # Tests unitarios
│   └── controllers/
│       └── community.controller.spec.ts
├── e2e/                          # Tests E2E HTTP (sin DB)
│   └── community.e2e-spec.ts
└── integration/                  # Tests de integración (con DB)
    └── community.integration-spec.ts

src/
└── andean/
    └── infra/
        └── controllers/
            └── community.controller.spec.ts  # Test unitario junto al código
```

## Ejemplo de Test con MongoDB Memory Server (Opcional)

Si quieres hacer tests de integración reales con base de datos:

```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';

let mongod: MongoMemoryServer;

beforeAll(async () => {
	mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri();

	const moduleFixture = await Test.createTestingModule({
		imports: [MongooseModule.forRoot(uri), CommunityModule],
	}).compile();

	// Ahora sí puedes importar el módulo completo
});

afterAll(async () => {
	await mongod.stop();
});
```

## Resumen

- ✅ **Test unitario:** Pasa porque no carga infraestructura
- ✅ **Test E2E (arreglado):** Pasa porque mockea use cases sin cargar MongoDB
- 📚 **Lección:** En tests E2E sin DB, mockea en el nivel de use cases, no importes módulos con dependencias de infraestructura
