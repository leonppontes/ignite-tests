import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import authConfig from '../../../../config/auth';

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IAuthenticateUserResponseDTO } from "./IAuthenticateUserResponseDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import { User } from '../../entities/User';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';


let usersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let valid_user: User;

describe('Sessions', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository;
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);

    valid_user = await createUserUseCase.execute({
        email: 'leon.pontes@mail.com',
        password: 'valid_password',
        name: 'Leon Pontes'
        
    })
  })

  test('Deve ser possível iniciar uma sessão', async () => {
    const result = await authenticateUserUseCase.execute({
      email: valid_user.email,
      password: 'valid_password'
    })
    expect(result).toHaveProperty('token')
  })

  test('Não deve ser possível iniciar uma sessão com um email não existente', async() => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'invalid@mail.com',
        password: 'valid_password'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  test('Não deve ser possível iniciar uma sessão com uma senha incorreta', async() => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: valid_user.email,
        password: 'invalid_password'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})