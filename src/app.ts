import { SecurityAggregate, ToDoAggregate } from '@domain';
import {
  CompleteToDoCommandInput,
  CreateToDoCommandInput,
  CreateUserCommandInput,
  GetAllToDosCommandInput,
  LoginCommandInput,
} from './commands';
import { AppConfig } from './common';
import {
  ToDoModel,
  ToDosBaseRepository,
  UserModel,
  UsersBaseRepository,
} from './persistence';
import {
  CompleteToDoUseCase,
  CreateToDoUseCase,
  CreateUserUseCase,
  GetAllToDosUseCase,
  LoginUseCase,
} from './use-cases';

export class App {
  private static _instance: App | null = null;
  private readonly securityAggregate: SecurityAggregate;
  private readonly toDoAggregate: ToDoAggregate;

  private constructor() {
    this.securityAggregate = new SecurityAggregate();
    this.toDoAggregate = new ToDoAggregate();
  }

  static get instance(): App {
    if (!App._instance) App._instance = new App();
    return App._instance;
  }

  login(
    loginCommand: LoginCommandInput,
    dependence: { userRepository: UsersBaseRepository }
  ): Promise<string> {
    const useCase = new LoginUseCase(
      AppConfig.instance,
      dependence.userRepository
    );
    return useCase.execute(loginCommand);
  }

  createUser(
    createUserCommand: CreateUserCommandInput,
    dependence: { userRepository: UsersBaseRepository }
  ): Promise<UserModel> {
    const useCase = new CreateUserUseCase(
      this.securityAggregate,
      dependence.userRepository
    );
    return useCase.execute(createUserCommand);
  }

  createToDo(
    createToDoCommand: CreateToDoCommandInput,
    dependence: { toDoRepository: ToDosBaseRepository }
  ): Promise<ToDoModel> {
    const useCase = new CreateToDoUseCase(
      this.toDoAggregate,
      dependence.toDoRepository
    );
    return useCase.execute(createToDoCommand);
  }

  completeToDo(
    completeToDoCommand: CompleteToDoCommandInput,
    dependence: { toDoRepository: ToDosBaseRepository }
  ): Promise<ToDoModel> {
    const useCase = new CompleteToDoUseCase(
      this.toDoAggregate,
      dependence.toDoRepository
    );
    return useCase.execute(completeToDoCommand);
  }

  getAllToDos(
    getAllToDosCommand: GetAllToDosCommandInput,
    dependence: { toDoRepository: ToDosBaseRepository }
  ): Promise<ToDoModel[]> {
    const useCase = new GetAllToDosUseCase(dependence.toDoRepository);
    return useCase.execute(getAllToDosCommand);
  }
}
