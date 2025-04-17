<h1 style="font-size: 24px; font-weight: bold; display:flex; align-items: center; justify-content: left; gap: 10px">
    <img src="https://nestjs.com/img/logo-small.svg" width="40" alt="Nest Logo" />
    Monolithic E-commerce
</h1>

## Description
- Infraestructura de un servidor monolito para una aplicación de comercio electrónico. Funciones principales del negocio (usuarios, productos, pagos), con su propia API y base de datos.
## Technologies
[![My Skills](https://skillicons.dev/icons?i=nestjs,typescript,prisma,docker,postgres,&perline=6)](https://skillicons.dev)
## Features
- Gestión de usuarios (registro, login, JWT authentication).
- Catálogo de productos con categorías y filtros.
- Procesamiento de pagos y manejo de órdenes.
## API Endpoints
```bash
POST   /auth/register        #Registra un nuevo usuario.
POST   /auth/login           #Inicia session un usuario registrado.

GET    /users/profile        #Obtener información del perfil del usuario autenticado.
GET    /users                #Obtiene toda la lista de usuarios, solo administradores autorizados.
GET    /users/:id            #Obtener informacion de un usuario en especifico mediante id.
PATCH  /users/:id            #Actualizar la informacion del usuario autenticado mediante id.

GET    /products             #Listado de productos por paginado y filtrado de categorias.
?page=                       #Pagina de productos que ver.
?limit=                      #Limite de productos que ver por pagina.
?category=                   #Categoria de productos que ver.
GET    /products/:id         #Obtener informacion de un producto en especifico mediante id.
POST   /products             #Agregar un nuevo producto, solo administradores autorizados.
PATCH  /products/:id         #Actualizar la información de un producto solo adminstrador autorizado.
DELETE /products/:id         #Remover el producto, solo administrador autorizado.

GET    /orders               #Listado de ordenes, solo administradores autorizados.
GET    /orders/:id           #Obtener informacion de la orden, debe estar autenticado.
POST   /orders               #ACrear una nueva orden, debe estar autenticado.
PATCH  /orders/:id           #Actualizar la información de una orden solo adminstrador autorizado.
PATCH  /orders/:id/status    #Actualizar estado de una orden solo adminstrador autorizado.
DELETE /orders/:id           #Eliminar la orden solo adminstrador autorizado.

GET    /payments             #Listado de pagos, solo administradores autorizados.
GET    /payments/:id         #Obtener informacion de un pago, debe estar autenticado.
POST   /payments             #Crear un nuevo pago, debe estar autenticado.
PATCH  /payments/:id         #Actualizar la información de un pago solo adminstrador autorizado.
PATCH  /payments/:id/confirm #Actualizar el estado del pago, solo administrador autorizado.
DELETE /payments/:id         #Remover el pago, solo administrador autorizado.

```
## Licence
Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
