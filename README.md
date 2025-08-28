# MongoAnime API

## Descripción

Esta es una API RESTful construida con **Node.js**, **Express** y **MongoDB (Mongoose)** para gestionar información de animes, datos de usuarios e historial de visualización.
Proporciona endpoints para **crear, leer, actualizar y eliminar (CRUD)** entradas de anime, perfiles de usuario y registrar qué animes han visto los usuarios.

## Características

- **Gestión de Animes:** Operaciones CRUD para entradas de anime.
- **Gestión de Usuarios:** Operaciones CRUD para perfiles de usuario.
- **Historial de Visualización:** Registro del historial de visualización de animes por los usuarios.
- **Autenticación/Autorización:** (Por confirmar, probablemente manejado en las rutas de usuarios).
- **Validación de Datos:** Validación de entradas usando `express-validator` y `Joi`.
- **Manejo de Errores:** Manejo centralizado de errores.
- **Paginación:** Recuperación eficiente de grandes conjuntos de datos usando `mongoose-paginate-v2`.

## Tecnologías Utilizadas

- **Node.js**
- **Express.js**
- **MongoDB** (con Mongoose ODM)
- **dotenv** → Variables de entorno
- **cors** → Cross-Origin Resource Sharing
- **morgan** → Logger de peticiones HTTP
- **express-validator** → Validación de solicitudes
- **Joi** → Validación de esquemas
- **mongoose-paginate-v2** → Paginación
- **nodemon** → Reinicios automáticos en desarrollo

## Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone <repository_url>
    cd mongoanime
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

3.  **Crea un archivo `.env`:**

    Crea un archivo `.env` en el directorio raíz del proyecto y añade tu URI de conexión a MongoDB:

    ```
    MONGODB_URI=your_mongodb_connection_string
    PORT=3000
    ```



## Uso

Para iniciar el servidor de desarrollo (con nodemon para reinicios automáticos):

```bash
npm run dev
```

Para iniciar el servidor de producción:

```bash
npm start
```

La API se ejecutará en el puerto especificado en tu archivo `.env` (por defecto: `3000`).

## Endpoints de la API

URL Base: `http://localhost:3000/api` (o tu puerto configurado)

### Endpoints de Anime (`/api/animes`)

*   `GET /api/animes`: Obtiene una lista paginada de animes.
*   `GET /api/animes/search`: Busca animes por un término de consulta.
*   `POST /api/animes/search/by-filter`: Filtra animes por criterios específicos (géneros, tipo, estado, etc.).
*   `GET /api/animes/list/latest-episodes`: Obtiene los últimos episodios agregados.
*   `GET /api/animes/list/latest-animes`: Obtiene los últimos animes agregados.
*   `GET /api/animes/list/on-air`: Obtiene la lista de animes en emisión.
*   `GET /api/animes/list/finished`: Obtiene la lista de animes finalizados.
*   `GET /api/animes/list/coming-soon`: Obtiene la lista de próximos animes.
*   `GET /api/animes/:slug`: Obtiene un anime por su slug.
*   `GET /api/animes/:slug/episodes`: Obtiene los episodios de un anime.
*   `GET /api/animes/:slug/episodes/:episode`: Obtiene los servidores de un episodio específico.
*   `POST /api/animes/new`: (Admin) Crea una nueva entrada de anime.
*   `PUT /api/animes/:id`: (Admin) Actualiza una entrada de anime existente por ID.
*   `DELETE /api/animes/:id`: (Admin) Elimina una entrada de anime por ID.

### Endpoints de Usuario (`/api/users`)

*   `GET /api/users`: Obtiene todos los usuarios.
*   `POST /api/users`: Crea un nuevo usuario.
*   `GET /api/users/:id`: Obtiene un usuario por ID.
*   `PATCH /api/users/:id`: Actualiza parcialmente un usuario por ID.
*   `DELETE /api/users/:id`: Elimina un usuario por ID.

### Endpoints de Historial (`/api/history`)

*   `GET /api/history/:userId/history`: Obtiene el historial de visualización de un usuario.
*   `POST /api/history/:userId/history`: Agrega un anime al historial de un usuario.
*   `GET /api/history/:userId/history/:animeSlug`: Obtiene el historial de un anime específico para un usuario.
*   `PATCH /api/history/:userId/history/:animeSlug`: Actualiza el historial de un anime específico (ej. episodio visto).
*   `DELETE /api/history/:userId/history/:animeSlug`: Elimina un anime del historial de un usuario.

## Esquema de la Base de Datos (Modelos)

### Anime

Representa una entrada de anime con detalles como título, descripción, género, etc.

### Usuario

Representa un perfil de usuario con detalles como nombre de usuario, correo electrónico, etc.

### Historial

Representa el historial de visualización de un usuario, vinculando usuarios a animes y potencialmente almacenando el progreso de visualización o el estado de finalización.

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar una Pull Request.

## Licencia

Este proyecto está bajo la Licencia ISC. Consulta el archivo `LICENSE` para más detalles. (Nota: Actualmente no hay un archivo `LICENSE` en la estructura proporcionada, pero es una buena práctica incluir uno).
