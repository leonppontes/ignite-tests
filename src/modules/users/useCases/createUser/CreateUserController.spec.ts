import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { app } from '../../../../app'

let connection: Connection

describe('Controller de criação de usuário', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  test('Deve ser possível criar um usuário', async () => {
    const response = await request(app).post('/api/v1/users').send({
        name: 'Pontes',
        email: 'leon.tes@mail.com',
        password: 'senhasupersecreta123'
    })

    expect(response.status).toBe(201)
  })

  test('Não deve ser possivel criar um usuário com um email já registrado', async () => {
    const response = await request(app).post('/api/v1/users').send({
        name: 'Pontes',
        email: 'leon.tes@mail.com',
        password: 'senhasupersecreta123'
    })
    expect(response.status).toBe(400)
  })
})