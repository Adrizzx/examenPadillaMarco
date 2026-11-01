# examenPadillaMarco

API REST de usuarios hecha con Node.js y Express para el repaso del examen práctico del Parcial 1 de Pruebas de Software (ESPE). Incluye reglas avanzadas de ESLint, validaciones con manejo de errores y pruebas unitarias con Jest y Supertest.

**Autor:** Marco Adrian Padilla Triviño
**Docente:** Ing. Mauricio Campaña

## Requisitos

- Node.js 20 o superior (probado con Node 22)
- npm

## Instalación

```bash
npm install
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Levanta la API en `http://localhost:3000` |
| `npm test` | Ejecuta las pruebas con Jest |
| `npm run test:coverage` | Ejecuta las pruebas y genera el reporte de cobertura |
| `npm run lint` | Revisa el código con ESLint |
| `npm run lint:fix` | Corrige automáticamente lo que ESLint puede arreglar |

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/marcopadilla/users` | Devuelve todos los usuarios |
| POST | `/api/marcopadilla/users` | Crea un usuario `{ name, email }` |
| GET | `/api/marcopadilla/users/:id` | Devuelve un usuario por ID |
| DELETE | `/api/marcopadilla/users/:id` | Elimina un usuario por ID |

## Validaciones

| Caso | Código | Mensaje |
|---|---|---|
| Nombre vacío o numérico | 400 | Name no puede ser un número o estar vacío |
| Email vacío | 400 | Email es obligatorio |
| Email sin formato válido | 400 | Formato de email inválido |
| Email repetido | 409 | Email ya existe |
| Usuario inexistente | 404 | Usuario no encontrado |
| Endpoint inexistente | 404 | Endpoint no encontrado |
| JSON mal formado | 400 | El cuerpo de la petición no es un JSON válido |
| Error inesperado | 500 | Error interno del servidor |

Todos los errores responden con el formato:

```json
{ "timestamp": "...", "status": 400, "message": "...", "path": "/api/marcopadilla/users" }
```

## Reglas de ESLint

`no-console`, `eqeqeq`, `camelcase`, `no-unused-vars`, `quotes: single`, `semi: always` y `max-lines-per-function: 20`.

## Probar a mano

Con la extensión REST Client de VS Code abre `requests.http` y da clic en **Send Request** sobre cada petición.

## Estructura

```
src/
  appPadillaMarco.js
  controllers/user.controller.js
  routes/user.routes.js
  utils/respuestaError.js
test/
  app.test.js
eslint.config.js
requests.http
```
