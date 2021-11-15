import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { hash } from 'bcryptjs'
import { app } from '../../../../app'

let connection: Connection
let token: any

describe('Controller de exibição de usuário', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO users (id, name, email, password)
      VALUES('${id}', 'admin', 'admin@finapi.com.br', '${password}')`
    )
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  beforeEach(async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'admin@finapi.com.br',
      password: 'admin'
    })
    token = response.body.token;
  })

  test('Deve ser possível exibir as informaçõe de um usuário  com token válido', async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  })

  test('Não deve ser possível exibir as informaçõe de um usuário com token inválido', async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer invalid_token`
    })

    expect(response.status).toBe(401);
    expect(response.body).not.toHaveProperty('user');
  })
})