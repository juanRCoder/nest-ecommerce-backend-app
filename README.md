<div style="display: flex ; align-items: center; gap: 10px">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="50" alt="Nest Logo" /></a>
  <h1 style="display: inline-block; vertical-align: middle; font-size: 24px; font-weight: bold;">Monolithic E-commerce</h1>
</div>

## Description
- Infraestructura de un servidor monolito el cual tiene como funcion implementar los servicios necesarios para realizar una tienda virtual(E-commerce).
## Technologies
[![My Skills](https://skillicons.dev/icons?i=nestjs,typescript,prisma,docker,postgres,&perline=6)](https://skillicons.dev)
## Features
- Gestión de usuarios (registro, login, JWT authentication).
- Catálogo de productos con categorías y filtros.
- Procesamiento de pagos y manejo de órdenes.
## API Endpoints
```bash
POST  /users/register  #Crear un nuevo usuario.
POST  /users/login     #Autenticación de usuarios.
GET   /users/:id       #Obtener información del perfil de un usuario.

GET   /products        #Listar productos con soporte para paginación y filtros.
POST  /products        #Agregar un nuevo producto.
PUT   /products/:id    #Actualizar la información de un producto.

POST  /payments        #Crear una nueva transacción de pago.
GET   /payments/:id    #Consultar el estado de un pago.
```
## Licence
Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
