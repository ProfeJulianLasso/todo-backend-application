import {
  App,
  AppConfig,
  CompleteToDoCommandInput,
  CreateToDoCommandInput,
  CreateUserCommandInput,
  GetAllToDosCommandInput,
  LoginCommandInput,
  ToDosBaseRepository,
  UsersBaseRepository,
} from '../src';
import * as useCases from '../src/use-cases';

jest.mock('../src/use-cases');

describe('App', () => {
  let app: App;
  let userRepository: UsersBaseRepository;
  let toDoRepository: ToDosBaseRepository;

  beforeEach(() => {
    app = App.instance;
    userRepository = {} as unknown as UsersBaseRepository;
    toDoRepository = {} as unknown as ToDosBaseRepository;
  });

  describe('login', () => {
    it('should return a token for a valid user', async () => {
      // Arrange
      const loginCommand: LoginCommandInput = {
        email: 'john.doe@example.com',
        password: 'password',
      };
      const expectedLoginCommand = { ...loginCommand };
      jest.spyOn(useCases, 'LoginUseCase');
      jest.spyOn(useCases.LoginUseCase.prototype, 'execute');

      // Act
      await app.login(loginCommand, { userRepository });

      // Assert
      expect(useCases.LoginUseCase).toHaveBeenCalledWith(
        AppConfig.instance,
        userRepository
      );
      expect(useCases.LoginUseCase.prototype.execute).toHaveBeenCalledWith(
        expectedLoginCommand
      );
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      // Arrange
      const createUserCommand: CreateUserCommandInput = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };
      const expectedCreateUserCommand = { ...createUserCommand };
      jest.spyOn(useCases, 'CreateUserUseCase');
      jest.spyOn(useCases.CreateUserUseCase.prototype, 'execute');

      // Act
      await app.createUser(createUserCommand, { userRepository });

      // Assert
      expect(useCases.CreateUserUseCase).toHaveBeenCalledWith(
        AppConfig.instance,
        userRepository
      );
      expect(useCases.CreateUserUseCase.prototype.execute).toHaveBeenCalledWith(
        expectedCreateUserCommand
      );
    });
  });

  describe('createToDo', () => {
    it('should create a to-do', async () => {
      // Arrange
      const createToDoCommand: CreateToDoCommandInput = {
        userId: 'valid-user-id',
        title: 'Buy groceries',
        description: 'Milk, bread, eggs',
      };
      const expectedCreateToDoCommand = { ...createToDoCommand };
      jest.spyOn(useCases, 'CreateToDoUseCase');
      jest.spyOn(useCases.CreateToDoUseCase.prototype, 'execute');

      // Act
      await app.createToDo(createToDoCommand, { toDoRepository });

      // Assert
      expect(useCases.CreateToDoUseCase).toHaveBeenCalledWith(
        AppConfig.instance,
        toDoRepository
      );
      expect(useCases.CreateToDoUseCase.prototype.execute).toHaveBeenCalledWith(
        expectedCreateToDoCommand
      );
    });
  });

  describe('completeToDo', () => {
    it('should complete a to-do', async () => {
      // Arrange
      const completeToDoCommand: CompleteToDoCommandInput = {
        toDoId: 'valid-to-do-id',
      };
      const expectedCompleteToDoCommand = { ...completeToDoCommand };
      jest.spyOn(useCases, 'CompleteToDoUseCase');
      jest.spyOn(useCases.CompleteToDoUseCase.prototype, 'execute');

      // Act
      await app.completeToDo(completeToDoCommand, { toDoRepository });

      // Assert
      expect(useCases.CompleteToDoUseCase).toHaveBeenCalledWith(
        AppConfig.instance,
        toDoRepository
      );
      expect(
        useCases.CompleteToDoUseCase.prototype.execute
      ).toHaveBeenCalledWith(expectedCompleteToDoCommand);
    });
  });

  describe('getAllToDos', () => {
    it('should return all to-dos', async () => {
      // Arrange
      const getAllToDosCommand: GetAllToDosCommandInput = {
        userId: 'valid-user-id',
      };
      const expectedGetAllToDosCommand = { ...getAllToDosCommand };
      jest.spyOn(useCases, 'GetAllToDosUseCase');
      jest.spyOn(useCases.GetAllToDosUseCase.prototype, 'execute');

      // Act
      await app.getAllToDos(getAllToDosCommand, {
        toDoRepository,
      });

      // Assert
      expect(useCases.GetAllToDosUseCase).toHaveBeenCalledWith(toDoRepository);
      expect(
        useCases.GetAllToDosUseCase.prototype.execute
      ).toHaveBeenCalledWith(expectedGetAllToDosCommand);
    });
  });
});
