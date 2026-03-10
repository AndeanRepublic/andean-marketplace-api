# Guía de Autenticación JWT

## Cómo usar JwtAuthGuard en tus controladores

### 1. Importar AuthModule en tu módulo

Para usar `JwtAuthGuard` en cualquier controlador, el módulo correspondiente **debe importar** `AuthModule`:

```typescript
import { AuthModule } from './auth.module';

@Module({
	imports: [
		// ... otros imports
		AuthModule, // ✅ Necesario para usar JwtAuthGuard
	],
	controllers: [TuController],
	providers: [
		/* ... */
	],
})
export class TuModule {}
```

### 2. Usar el Guard en tus controladores

#### Proteger rutas específicas:

```typescript
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../core/jwtAuth.guard';
import { CurrentUser } from '../core/current-user.decorator';

@Controller('mi-ruta')
export class MiController {
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('JWT-auth') // Para Swagger
	@Get('protegida')
	async rutaProtegida(@CurrentUser() user: any) {
		// user contiene: { userId: string, role: AccountRole }
		return { message: 'Acceso autorizado', user };
	}
}
```

#### Rutas públicas (sin autenticación):

```typescript
import { Public } from '../core/public.decorator';

@Public()
@Post('login')
async login(@Body() body: LoginDto) {
  // Esta ruta no requiere token JWT
}
```

#### Combinar con RolesGuard:

```typescript
import { Roles } from '../core/roles.decorator';
import { RolesGuard } from '../core/roles.guard';
import { AccountRole } from '../../domain/enums/AccountRole';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AccountRole.ADMIN)
@ApiBearerAuth('JWT-auth')
@Put('admin-only')
async adminOnly(@CurrentUser() user: any) {
  // Solo usuarios con rol ADMIN pueden acceder
}
```

### 3. Decoradores disponibles

- **`@Public()`** - Marca una ruta como pública (no requiere JWT)
- **`@CurrentUser()`** - Obtiene el usuario autenticado del request
- **`@Roles(...roles)`** - Define qué roles pueden acceder (usar con RolesGuard)

### 4. Estructura del usuario en el request

Después de pasar por `JwtAuthGuard`, el request contiene:

```typescript
request.user = {
	userId: string, // ID del usuario (payload.sub)
	role: AccountRole, // Rol del usuario
};
```

### 5. Testing con Swagger

1. Inicia sesión en `/api/v1/andean/auth/login`
2. Copia el token JWT de la respuesta
3. En Swagger, haz click en "Authorize" (🔒)
4. Pega el token (sin "Bearer")
5. Ahora puedes probar endpoints protegidos

## Solución de problemas

### Error: "Nest can't resolve dependencies of the JwtAuthGuard"

**Causa**: El módulo no importa `AuthModule`

**Solución**:

```typescript
@Module({
  imports: [
    AuthModule, // ✅ Agregar esto
  ],
})
```

### El token es rechazado

**Verificar**:

1. El token está en el header: `Authorization: Bearer <token>`
2. El token no ha expirado
3. La variable `JWT_SECRET` coincide en generación y validación

## Arquitectura

```
AuthModule
├── JwtModule (configurado con secret)
├── JwtAuthGuard (valida tokens)
└── Exports: [JwtAuthGuard, JwtModule]

OtrosModules
└── imports: [AuthModule] ✅
```
