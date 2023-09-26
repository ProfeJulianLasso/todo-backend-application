import * as domain from '@domain';
import {
  CreateToDoCommand,
  CreateToDoCommandInput,
  CreateToDoUseCase,
  ToDoModel,
  ToDosBaseRepository,
} from '../../src';
import * as validator from '../../src/commands/validators/create-to-do.validator';

jest.mock('@domain');
jest.mock('../../src/commands/validators/create-to-do.validator');

describe('CreateToDoUseCase', () => {
  let userId: string;
  let toDoId: string | undefined;
  let title: string;
  let description: string | undefined;
  let completed: boolean;
  let status: boolean;

  beforeAll(() => {
    userId = 'bb13f8c7-33cb-499c-a9c8-a9e7ef2715a9';
    toDoId = 'a9711f64-04b1-40fd-81f1-fabb4806fb1b';
    title = 'My ToDo';
    description = 'My ToDo description';
    completed = false;
    status = true;
  });

  it('should create a new ToDo and persist it in the repository', async () => {
    // Arrange
    const expectedUserId = 'bb13f8c7-33cb-499c-a9c8-a9e7ef2715a9';
    const expectedToDoId = 'a9711f64-04b1-40fd-81f1-fabb4806fb1b';
    const expectedTitle = 'My ToDo';
    const expectedDescription = 'My ToDo description';
    const expectedCompleted = false;
    const expectedStatus = true;
    const aggregate = new domain.ToDoAggregate();
    const repository = {
      create: jest.fn(),
    } as unknown as ToDosBaseRepository;
    const command = {
      userId,
      title,
      toDoId,
      description,
    } as CreateToDoCommandInput;
    const expectedCommand = {
      userId: { value: userId },
      title: { value: title },
      toDoId: { value: toDoId },
      description: { value: description },
    } as CreateToDoCommand;
    jest.spyOn(validator, 'CreateToDoValidator');
    jest
      .spyOn(validator.CreateToDoValidator.prototype, 'validate')
      .mockReturnValue();
    jest
      .spyOn(domain, 'UserIdValueObject')
      .mockImplementation(
        id => ({ value: id }) as unknown as domain.UserIdValueObject
      );
    jest
      .spyOn(domain, 'ToDoTitleValueObject')
      .mockImplementation(
        title => ({ value: title }) as unknown as domain.ToDoTitleValueObject
      );
    jest.spyOn(domain, 'ToDoDescriptionValueObject').mockImplementation(
      description =>
        ({
          value: description,
        }) as unknown as domain.ToDoDescriptionValueObject
    );
    jest
      .spyOn(domain, 'ToDoIdValueObject')
      .mockImplementation(
        id => ({ value: id }) as unknown as domain.ToDoIdValueObject
      );
    jest
      .spyOn(domain, 'User')
      .mockImplementation(
        user => ({ userId: user.userId }) as unknown as domain.User
      );
    jest.spyOn(aggregate, 'createToDo').mockReturnValue({
      toDoId: { value: toDoId },
      title: { value: title },
      description: { value: description },
      user: { userId: { value: userId } },
      completed: { value: completed },
      status: { value: status },
    } as domain.ToDo);
    jest.spyOn(repository, 'create').mockResolvedValue({
      toDoId,
      userId,
      title,
      description,
      isCompleted: completed,
      status,
      createdAt: 123456789,
    } as ToDoModel);

    // Act
    const useCase = new CreateToDoUseCase(aggregate, repository);
    await useCase.execute(command);

    // Assert
    expect(domain.UserIdValueObject).toHaveBeenCalledWith(expectedUserId);
    expect(domain.ToDoTitleValueObject).toHaveBeenCalledWith(expectedTitle);
    expect(domain.ToDoDescriptionValueObject).toHaveBeenCalledWith(
      expectedDescription
    );
    expect(domain.ToDoIdValueObject).toHaveBeenCalledWith(expectedToDoId);
    expect(validator.CreateToDoValidator).toHaveBeenCalledWith(expectedCommand);
    expect(aggregate.createToDo).toHaveBeenCalledWith({
      toDoId: {
        value: expectedToDoId,
      } as domain.ToDoIdValueObject,
      title: {
        value: expectedTitle,
      } as domain.ToDoTitleValueObject,
      description: {
        value: expectedDescription,
      } as domain.ToDoDescriptionValueObject,
      user: {
        userId: {
          value: expectedUserId,
        } as domain.UserIdValueObject,
      } as domain.User,
    });
    expect(repository.create).toHaveBeenCalledWith({
      toDoId: expectedToDoId,
      userId: expectedUserId,
      title: expectedTitle,
      description: expectedDescription,
      isCompleted: expectedCompleted,
      status: expectedStatus,
    } as ToDoModel);
  });

  it('should create a new ToDo and persist it in the repository without toDoId and description', async () => {
    // Arrange
    toDoId = undefined;
    description = undefined;
    const expectedToDoId = 'valid-to-do-id';
    const expectedUserId = 'bb13f8c7-33cb-499c-a9c8-a9e7ef2715a9';
    const expectedTitle = 'My ToDo';
    const expectedCompleted = false;
    const expectedStatus = true;
    const aggregate = new domain.ToDoAggregate();
    const repository = {
      create: jest.fn(),
    } as unknown as ToDosBaseRepository;
    const command = {
      userId,
      title,
    } as CreateToDoCommandInput;
    const expectedCommand = {
      userId: { value: userId },
      title: { value: title },
      toDoId: undefined,
      description: undefined,
    } as CreateToDoCommand;
    jest.spyOn(validator, 'CreateToDoValidator');
    jest
      .spyOn(validator.CreateToDoValidator.prototype, 'validate')
      .mockReturnValue();
    jest
      .spyOn(domain, 'UserIdValueObject')
      .mockImplementation(
        id => ({ value: id }) as unknown as domain.UserIdValueObject
      );
    jest
      .spyOn(domain, 'ToDoTitleValueObject')
      .mockImplementation(
        title => ({ value: title }) as unknown as domain.ToDoTitleValueObject
      );
    jest
      .spyOn(domain, 'User')
      .mockImplementation(
        user => ({ userId: user.userId }) as unknown as domain.User
      );
    jest.spyOn(aggregate, 'createToDo').mockReturnValue({
      toDoId: { value: 'valid-to-do-id' },
      title: { value: title },
      user: { userId: { value: userId } },
      completed: { value: completed },
      status: { value: status },
    } as domain.ToDo);
    jest.spyOn(repository, 'create').mockResolvedValue({
      toDoId: 'valid-to-do-id',
      userId,
      title,
      isCompleted: completed,
      status,
      createdAt: 123456789,
    } as ToDoModel);

    // Act
    const useCase = new CreateToDoUseCase(aggregate, repository);
    await useCase.execute(command);

    // Assert
    expect(domain.UserIdValueObject).toHaveBeenCalledWith(expectedUserId);
    expect(domain.ToDoTitleValueObject).toHaveBeenCalledWith(expectedTitle);
    expect(validator.CreateToDoValidator).toHaveBeenCalledWith(expectedCommand);
    expect(aggregate.createToDo).toHaveBeenCalledWith({
      title: {
        value: expectedTitle,
      } as domain.ToDoTitleValueObject,
      user: {
        userId: {
          value: expectedUserId,
        } as domain.UserIdValueObject,
      } as domain.User,
    });
    expect(repository.create).toHaveBeenCalledWith({
      toDoId: expectedToDoId,
      userId: expectedUserId,
      title: expectedTitle,
      isCompleted: expectedCompleted,
      status: expectedStatus,
    } as ToDoModel);
  });
});
