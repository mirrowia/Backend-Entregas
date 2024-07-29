# Entrega: Mocking y manejo de errores

```diff
 npm install connect-mongo cookie-parser express express-handlebars express-session handlebars-helpers mongoose mongoose-paginate-v2 router toastify-js bcrypt passport passport-local passport-github2 commander dotenv nodemailer socket.oi swagger-jsdoc swagger-ui-express multer
```

## Credenciales Administrador
Usuario: _adminCoder<span>@</span>coder.com_<br />
Clave: _adminCod3r123_<br />

Probar con los productos que tengan owner, el resto falta actualizar con esta propiedad

## Endpoints

### Product

| Método| Endpoint                                | Descripción                                            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /api/products/                          | Listado de productos en formato JSON                   |
| POST  | /api/products/manager/new-product       | Envía un producto nuevo en formato JSON                |
| DELETE| /api/products/manager/:id               | Elimina un producto                                    |
| GET   | /api/products/categories                | Listado de categorias en formato JSON                  |
| GET   | /api/products/:id                       | Producto en formato JSON                               |
| PUT   | /api/products/:id                       | Enviar producto en formato JSON para editar            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /shop/products/                         | Pagina con el listado de productos                    |
| GET   | /shop/products/manager                  | Página con listados de productos para el administrador|
| GET   | /shop/products/manager/new-product      | Página para agregar un producto                       |
| GET   | /shop/products/categories               | Listado de categorias en formato JSON                 |
| GET   | /shop/products/:id                      | Producto en formato JSON                              |

### Session

| Método| Endpoint                                | Descripción                                            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| POST  | /api/sessions/login                     | Envía datos para el inicio de sesión                   |
| POST  | /api/sessions/register                  | Envía datos para realizar el registro                  |
| POST  | /api/sessions/logout                    | Realiza el cierre de sesión                            |
| POST  | /api/sessions/passwordChange            | Envia datos para el cambio de clave                    |
| PUT   | /api/sessions/passwordChange            | Cambia la clave de un usuario                          |
| GET   | /api/sessions/github                    | Página de inicio de sesión con GitHub                  |
| GET   | /api/sessions/githubcallback            | Inicio de sesión con GitHub                            |
| GET   | /api/sessions/current                   | Trae datos en formato JSON del usuario                 |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /shop/sessions/login                    | Muestra página para el inicio de sesión                |
| GET   | /shop/sessions/register                 | Muestra página de registro                             |
| GET   | /shop/sessions/password-recover         | Muetra página para recuperar la clase                  |
| GET   | /shop/sessions/password-recover/:uid    | Muetra página para recuperar la clave con usuario      |
| GET   | /shop/sessions/password-change          | Muestra página para cambiar la clave                   |
| GET   | /shop/sessions/profile                  | Muestra página del perfil de usuario                   |

### Cart

| Método| Endpoint                                | Descripción                                            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /api/carts/                             | Devuelve un listado de los carritos                    |
| GET   | /api/carts/:cid                         | Devuelve la página de un carrito                       |
| PUT   | /api/carts/:cid                         | Agrega productos al carrito                            |
| GET   | /api/carts/:cid/purchase                | Muestra página con detalles de la compra               |
| PUT   | /api/carts/:cid/purchase/:pid           | Actualiza la cantidad de productos en el carrito       |
| DELETE| /api/carts/:cid/products/:pid           | Elimina producto del carrito                           |
| DELETE| /api/carts/:cid                         | Elimina todos los productos del carrito                |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /shop/carts/:cid                        | Devuelve la página de un carrito                       |
| GET   | /shop/carts/:cid/purchase               | Genera ticket de la compra                             |
| GET   | /shop/carts/:cid/purchase/:tid          | Muestra página con detalles de la compra               |


### Community

| Método| Endpoint                                | Descripción                                            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /shop/community/chat                    | Muestra página de la comunidad (Chat)                  |

### Mocks

| Método| Endpoint                                | Descripción                                            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /api/mockingproducts/                   | Devuelve 100 productos para prueba                     |
| GET   | /api/lgger-test/                        | Endpoint para probar el logger                         |

### User

| Método| Endpoint                                | Descripción                                            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /api/users/premium/:id                         | Muestra página de la comunidad (Chat)           |