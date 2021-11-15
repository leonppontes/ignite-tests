import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { hash } from 'bcryptjs'
import { app } from '../../../../app'

let connection: Connection;

describe('Controller de criação de usuário', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid()
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO users (id, name, email, password)
      VALUES('${id}', 'admin', 'admin@finapi.com.br', '${password}')`
    )
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  test('Deve ser possível iniciar uma sessão com um usuário válido', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'admin@finapi.com.br',
      password: 'admin'
    });

    expect(response.body).toHaveProperty('token');
    expect(response.body.user.name).toBe('admin');
  })

  test(' Não deve ser possível iniciar uma sessão com um email incorreto', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'invalid_mail@finapi.com.br',
      password: 'admin'
    });

    expect(response.status).toBe(401);
  })

  test(' Não deve ser possível iniciar uma sessão com uma senha incorreta', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'admin@finapi.com.br',
      password: 'invalid_password'
    })

    expect(response.status).toBe(401);
  })
})