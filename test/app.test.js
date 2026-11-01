const request = require('supertest');
const app = require('../src/appPadillaMarco');

const RUTA = '/api/marcopadilla/users';

describe('API de usuarios /api/marcopadilla/users', () => {
  // 1. Crear usuario válido
  test('POST debería crear un usuario válido', async () => {
    const nuevoUsuario = { name: 'Lucia Andrade', email: 'lucia.andrade@test.com' };

    const response = await request(app).post(RUTA).send(nuevoUsuario);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(nuevoUsuario.name);
    expect(response.body.email).toBe(nuevoUsuario.email);
  });

  // 2. Error por datos inválidos: email vacío
  test('POST debería devolver 400 cuando el email está vacío', async () => {
    const response = await request(app).post(RUTA).send({ name: 'Marco Padilla', email: '' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email es obligatorio');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body.path).toBe(RUTA);
  });

  // 3. Error por datos inválidos: nombre numérico
  test('POST debería devolver 400 cuando el name es un número', async () => {
    const response = await request(app).post(RUTA).send({ name: '123', email: 'valido@test.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Name no puede ser un número o estar vacío');
  });

  // 4. Error por datos inválidos: formato de email
  test('POST debería devolver 400 cuando el email no tiene formato válido', async () => {
    const response = await request(app).post(RUTA).send({ name: 'Ana Vega', email: 'ana.vega.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Formato de email inválido');
  });

  // 5. Error por email duplicado
  test('POST debería devolver 409 cuando el email ya existe', async () => {
    const usuario = { name: 'Usuario Duplicado', email: 'duplicado@test.com' };
    await request(app).post(RUTA).send(usuario).expect(201);

    const response = await request(app).post(RUTA).send(usuario);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email ya existe');
  });

  // 6. Listado de usuarios
  test('GET debería devolver la lista de usuarios', async () => {
    const response = await request(app).get(RUTA);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
    expect(response.body[0]).toHaveProperty('name');
  });

  // 7. Obtener usuario por id
  test('GET /:id debería devolver el usuario solicitado', async () => {
    const creado = await request(app).post(RUTA).send({ name: 'Pedro Mena', email: 'pedro.mena@test.com' });

    const response = await request(app).get(`${RUTA}/${creado.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(creado.body.id);
    expect(response.body.email).toBe('pedro.mena@test.com');
  });

  // 8. Error al obtener un usuario inexistente
  test('GET /:id debería devolver 404 si el usuario no existe', async () => {
    const response = await request(app).get(`${RUTA}/999999`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Usuario no encontrado');
    expect(response.body).toHaveProperty('path');
  });

  // 9. Eliminar usuario y verificar que ya no existe
  test('DELETE /:id debería eliminar el usuario y luego no encontrarlo', async () => {
    const creado = await request(app).post(RUTA).send({ name: 'Usuario Borrar', email: 'borrar@test.com' });
    const id = creado.body.id;

    const eliminado = await request(app).delete(`${RUTA}/${id}`);
    expect(eliminado.status).toBe(200);
    expect(eliminado.body.message).toBe('Usuario eliminado correctamente');
    expect(eliminado.body.user.id).toBe(id);

    const consulta = await request(app).get(`${RUTA}/${id}`);
    expect(consulta.status).toBe(404);
  });

  // 10. Error al eliminar un usuario inexistente
  test('DELETE /:id debería devolver 404 si el usuario no existe', async () => {
    const response = await request(app).delete(`${RUTA}/888888`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Usuario no encontrado');
  });

  // 11. Ruta general para endpoints que no existen
  test('debería devolver 404 para un endpoint que no existe', async () => {
    const response = await request(app).get('/api/marcopadilla/productos');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Endpoint no encontrado');
  });

  // 12. JSON mal formado
  test('POST debería devolver 400 si el cuerpo no es un JSON válido', async () => {
    const response = await request(app)
      .post(RUTA)
      .set('Content-Type', 'application/json')
      .send('{"name": "Marco", ');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('El cuerpo de la petición no es un JSON válido');
  });
  // 13. Petición sin cuerpo
  test('POST debería devolver 400 cuando no se envía cuerpo', async () => {
    const response = await request(app).post(RUTA);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Name no puede ser un número o estar vacío');
  });
  // 14. Error inesperado del servidor
  test('debería devolver 500 si ocurre un error inesperado', async () => {
    let appConError;
    jest.isolateModules(() => {
      jest.doMock('../src/routes/user.routes', () => {
        const router = require('express').Router();
        router.get('/', () => {
          throw new Error('Fallo simulado');
        });
        return router;
      });
      appConError = require('../src/appPadillaMarco');
    });

    const response = await request(appConError).get(RUTA);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error interno del servidor');
  });
});
