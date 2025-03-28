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
POST  /auth/register   #Registra un nuevo usuario.
POST  /auth/login      #Inicia session el usuario autenticado.

GET   /users/profile   #Obtener información del perfil del usuario.
GET   /users/:id       #Obtener informacion de un usuario en especifico.
PUT   /users/:id       #Actualizar la informacion de un usuario en concreto.

GET   /products        #Listar productos con soporte para paginación y filtros.
POST  /products        #Agregar un nuevo producto.
PUT   /products/:id    #Actualizar la información de un producto.

POST  /payments        #Crear una nueva transacción de pago.
GET   /payments/:id    #Consultar el estado de un pago.
```
## Licence
Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
