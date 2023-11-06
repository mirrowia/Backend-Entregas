# Entrega: Mocking y manejo de errores

```diff
 npm install connect-mongo cookie-parser express express-handlebars express-session handlebars-helpers mongoose mongoose-paginate-v2 router toastify-js bcrypt passport passport-local passport-github2 commander dotenv nodemailer socket.oi
```

## Credenciales Administrador
Usuario: _adminCoder<span>@</span>coder.com_<br />
Clave: _adminCod3r123_<br />

## Endpoints

### Product

| Método| Endpoint                                | Descripción                                            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /api/products/                          | Listado de productos en formato JSON                   |
| GET   | /api/products/list                      | Devuelve una página con el listado de productos        |
| GET   | /api/products/manager                   | Página con listados de productos para el administrador |
| GET   | /api/products/manager/new-product       | Página para agregar un producto                        |
| POST  | /api/products/manager/new-product       | Envía un producto nuevo en formato JSON                |
| DELETE| /api/products/manager/:id               | Elimina un producto                                    |
| GET   | /api/products/categories                | Listado de categorias en formato JSON                  |
| GET   | /api/products/:id                       | Producto en formato JSON                               |
| PUT   | /api/products/:id                       | Enviar producto en formato JSON para editar            |

### Session

| Método| Endpoint                                | Descripción                                            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /api/sessions/login                     | Muestra página para el inicio de sesión                |
| POST  | /api/sessions/login                     | Envía datos para el inicio de sesión                   |
| GET   | /api/sessions/register                  | Muestra página de registro                             |
| POST  | /api/sessions/register                  | Envía datos para realizar el registro                  |
| POST  | /api/sessions/logout                    | Realiza el cierre de sesión                            |
| GET   | /api/sessions/passwordChange            | Muetra página para el cambio de clave                  |
| POST  | /api/sessions/passwordChange            | Envia datos para el cambio de clave                    |
| PUT   | /api/sessions/passwordChange            | Cambia la clave de un usuario                          |
| GET   | /api/sessions/github                    | Página de inicio de sesión con GitHub                  |
| GET   | /api/sessions/githubcallback            | Inicio de sesión con GitHub                            |
| GET   | /api/sessions/current                   | Trae datos en formato JSON del usuario                 |
| GET   | /api/sessions/                          | Muestra página del perfil de usuario                   |

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

### Community

| Método| Endpoint                                | Descripción                                            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /api/community/                         | Muestra página de la comunidad (Chat)                  |

### Mocks

| Método| Endpoint                                | Descripción                                            |
| ------| --------------------------------------- | ------------------------------------------------------ |
| GET   | /api/mockingproducts/                   | Devuelve 100 productos para prueba                     |