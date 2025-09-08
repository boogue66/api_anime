# MongoAnime API

## Descripción

Esta es una API RESTful construida con **Node.js**, **Express** y **MongoDB (Mongoose)** para gestionar información de animes, datos de usuarios e historial de visualización.
Proporciona endpoints para **crear, leer, actualizar y eliminar (CRUD)** entradas de anime, perfiles de usuario y registrar qué animes han visto los usuarios.

## Características

- **Gestión de Animes:** Operaciones CRUD para entradas de anime.
- **Gestión de Usuarios:** Operaciones CRUD para perfiles de usuario.
- **Historial de Visualización:** Registro del historial de visualización de animes por los usuarios.
- **Autenticación/Autorización:** Autenticación basada en JWT para proteger las rutas.
- **Validación de Datos:** Validación de entradas usando `express-validator` y `Joi`.
- **Manejo de Errores:** Manejo centralizado de errores.
- **Paginación:** Recuperación eficiente de grandes conjuntos de datos usando `mongoose-paginate-v2`.

## Tecnologías Utilizadas

- **Node.js**
- **Express.js**
- **MongoDB** (con Mongoose ODM)
- **jsonwebtoken** → Autenticación basada en JSON Web Tokens.
- **bcryptjs** → Hashing de contraseñas.
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

    Crea un archivo `.env` en el directorio raíz del proyecto y añade tu URI de conexión a MongoDB y tus secretos de JWT:

    ```
    MONGODB_URI=your_mongodb_connection_string
    PORT=3000
    JWT_SECRET=your-secret-key
    JWT_EXPIRES_IN=90d
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

## Autenticación

Para acceder a las rutas protegidas, primero debes obtener un token de autenticación. Para ello, puedes registrar un nuevo usuario o iniciar sesión con un usuario existente.

- **Registro:** Envía una petición `POST` a `/api/users/signup` con `username`, `email` y `password` en el cuerpo de la petición.
- **Inicio de sesión:** Envía una petición `POST` a `/api/users/login` con `email` y `password` en el cuerpo de la petición.

Ambas rutas devolverán un token de autenticación. Debes incluir este token en la cabecera `Authorization` de tus peticiones a las rutas protegidas, con el formato `Bearer <token>`.

## Endpoints de la API

URL Base: `http://localhost:3000/api` (o tu puerto configurado)

### Endpoints de Autenticación (`/api/users`)

*   `POST /api/users/signup`: Registra un nuevo usuario.
*   `POST /api/users/login`: Inicia sesión y obtiene un token de autenticación.

### Endpoints de Anime (`/api/animes`)

*   `GET /api/animes`: Obtiene una lista paginada de animes.
*   `GET /api/animes/search`: Busca animes por un término de consulta.
*   `POST /api/animes/search/by-filter`: Filtra animes por criterios específicos (géneros, tipo, estado, etc.).
*   `GET /api/animes/list/latest-episodes`: Obtiene los animes con los últimos episodios actualizados (ordenados por la fecha de última actualización del anime).
*   `GET /api/animes/list/latest-animes`: Obtiene los últimos animes agregados.
*   `GET /api/animes/list/on-air`: Obtiene la lista de animes en emisión.
*   `GET /api/animes/list/finished`: Obtiene la lista de animes finalizados.
*   `GET /api/animes/list/coming-soon`: Obtiene la lista de próximos animes.
*   `GET /api/animes/:slug`: Obtiene un anime por su slug, con los episodios paginados.
*   `GET /api/animes/:slug/episodes`: Obtiene la lista de episodios paginada de un anime.
*   `GET /api/animes/:slug/episodes/:episode`: Obtiene los servidores de un episodio específico.
*   `POST /api/animes/new`: (Protegido) Crea una nueva entrada de anime.
*   `PUT /api/animes/:id`: (Protegido) Actualiza una entrada de anime existente por ID.
*   `DELETE /api/animes/:id`: (Protegido) Elimina una entrada de anime por ID.

#### Detalles de Endpoints de Anime

**`GET /api/animes/:slug`**

Obtiene los detalles principales de un anime específico para una carga rápida. Los episodios se devuelven de forma paginada.

*   **Parámetros de Consulta (Query Params):**
    *   `page` (opcional, por defecto: `1`): El número de página de episodios a devolver.
    *   `limit` (opcional, por defecto: `25`): El número de episodios por página.

*   **Respuesta de Ejemplo:**

    ```json
    {
      "title": "One Piece",
      "slug": "one-piece-url",
      "poster": "url_del_poster.jpg",
      "status": "En emision",
      "genres": ["Action", "Adventure", "Comedy", "Fantasy"],
      "last_episode": 1100,
      "episodes": [
        // ... array de episodios para la página solicitada
      ],
      "episodesPagination": {
        "totalEpisodes": 1100,
        "totalPages": 44,
        "currentPage": 1,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
    ```

**`GET /api/animes/:slug/episodes`**

Obtiene la lista de episodios de un anime de forma paginada. Este endpoint ahora está correctamente implementado y optimizado.

*   **Parámetros de Consulta (Query Params):**
    *   `page` (opcional, por defecto: `1`): El número de página de episodios a devolver.
    *   `limit` (opcional, por defecto: `25`): El número de episodios por página.

*   **Respuesta de Ejemplo:**

    ```json
    {
      "episodes": [
        // ... array de episodios para la página solicitada
      ],
      "totalEpisodes": 1100,
      "totalPages": 44,
      "currentPage": 1,
      "hasNextPage": true,
      "hasPrevPage": false
    }
    ```

### Endpoints de Historial (`/api/history`)

*   `GET /api/history/:userId/history`: Obtiene el historial de visualización de un usuario, incluyendo los detalles completos del anime.

    *   **Respuesta de Ejemplo:**

        ```json
        {
          "status": "success",
          "results": 1,
          "data": {
            "history": [
              {
                "_id": "65f2a9b3b3f3b3f3b3f3b3f3",
                "userId": "65f2a9b3b3f3b3f3b3f3b3f2",
                "status": "watching",
                "episodesWatched": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                "lastEpisode": 12,
                "createdAt": "2025-09-07T15:00:00.000Z",
                "updatedAt": "2025-09-07T15:00:00.000Z",
                "anime": {
                  "slug": "shingeki-no-kyojin",
                  "title": "Shingeki no Kyojin",
                  "poster": "https://example.com/poster/shingeki.jpg",
                  "synopsis": "Eren Jaeger vive en un mundo post-apocalíptico...",
                  "genres": ["Action", "Drama", "Fantasy"]
                }
              }
            ]
          }
        }
        ```
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

Representa el historial de visualización de un usuario, vinculando usuarios a animes y potencialmente almacenando el progreso de visualización o el estado de finalización. Incluye timestamps `createdAt` y `updatedAt` para registrar la creación y última actualización.

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar una Pull Request.

## Licencia

Este proyecto está bajo la Licencia ISC. Consulta el archivo `LICENSE` para más detalles. (Nota: Actualmente no hay un archivo `LICENSE` en la estructura proporcionada, pero es una buena práctica incluir uno).
