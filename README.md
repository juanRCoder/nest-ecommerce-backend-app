<h1 style="font-size: 24px; font-weight: bold; display:flex; align-items: center; justify-content: left; gap: 10px">
    <img src="https://nestjs.com/img/logo-small.svg" width="40" alt="Nest Logo" />
    Monolithic E-commerce
</h1>

## Descripción
Infraestructura de un servidor monolítico para una aplicación de comercio electrónico. Incluye funcionalidades clave como autenticación de usuarios, gestión de productos, creación de órdenes y procesamiento de pagos, cada uno con su propia API, conectadas a una base de datos relacional.
## Tecnologías
[![My Skills](https://skillicons.dev/icons?i=pnpm,nestjs,typescript,prisma,docker,postgres,supabase&perline=7)](https://skillicons.dev)
## Características
- Registro e inicio de sesión de usuarios con autenticación JWT.
- Gestión completa del catálogo de productos con filtros por categoría.
- Creación de órdenes asociadas al cliente.
- Procesamiento de pagos y actualización de stock automáticamente.
## API Endpoints
```bash
# AUTH
POST   /auth/register         # Registrar nuevo usuario
POST   /auth/login            # Iniciar sesión

# USERS
GET    /users/profile         # Perfil del usuario (requiere auth)
GET    /users                 # Listado de usuarios (solo admin)
GET    /users/:id             # Ver usuario por ID
PATCH  /users/:id             # Actualizar usuario (requiere auth)

# PRODUCTS
GET    /products              # Listado con paginación y filtros
        ?page=                # Página
        ?limit=               # Límite por página
        ?category=            # Categoría a filtrar
GET    /products/:id          # Ver producto por ID
POST   /products              # Crear producto (solo admin)
PATCH  /products/:id          # Actualizar producto (solo admin)
DELETE /products/:id          # Eliminar producto (solo admin)

# ORDERS
GET    /orders                # Listado de órdenes (solo admin)
GET    /orders/:id            # Ver orden (requiere auth)
POST   /orders                # Crear orden (requiere auth)
PATCH  /orders/:id            # Actualizar orden (solo admin)
PATCH  /orders/:id/status     # Cambiar estado de orden (solo admin)
DELETE /orders/:id            # Eliminar orden (solo admin)

# PAYMENTS
GET    /payments              # Listado de pagos (solo admin)
GET    /payments/:id          # Ver pago (requiere auth)
POST   /payments              # Crear pago (requiere auth)
PATCH  /payments/:id          # Actualizar pago (solo admin)
PATCH  /payments/:id/confirm  # Confirmar pago (solo admin)
DELETE /payments/:id          # Eliminar pago (solo admin)

```
## Licencia
Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
