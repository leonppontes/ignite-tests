import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'
import { User } from '../../entities/User';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileError } from './ShowUserProfileError';


let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let valid_user: User;

describe('Exibe informações de um usuário', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);

    valid_user = await createUserUseCase.execute({
      email: 'john.doe@mail.com',
      name: 'John Doe',
      password: 'valid_password'
    })
  });

  test('Deve ser possivel exibir as informações de um usuário', async () => {
    const user = await showUserProfileUseCase.execute(`${valid_user.id}`);
    expect(user).toBeInstanceOf(User);
  })

  test('Não deve ser possível exibir informações de um usuário não existente', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('invalid_id');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })

})