import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Criação de usuários', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository;
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  test('Deve ser possível criar um novo usuário', async () => {
    const valid_user = {
      name: 'Leon Pontes',
      email: 'leon.pontes@mail.com',
      password: 'myPasswordIsReallySafe'
    };
    const user = await createUserUseCase.execute(valid_user)
    expect(user).toHaveProperty('id');
  })

  test('Não deve ser possivel criar dois usuários com o mesmo email', async () => {
    const valid_user = {
        name: 'Leon Pontes',
        email: 'leon.pontes@mail.com',
        password: 'myPasswordIsReallySafe'
    };
    await createUserUseCase.execute(valid_user)
    expect(async () => {
      await createUserUseCase.execute(valid_user)
    }).rejects.toBeInstanceOf(AppError);
  })
})