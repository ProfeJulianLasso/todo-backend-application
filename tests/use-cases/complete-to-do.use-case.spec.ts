import * as domain from '@domain';
import {
  CompleteToDoCommandInput,
  CompleteToDoUseCase,
  ToDoModel,
  ToDosBaseRepository,
} from '../../src';
import * as validator from '../../src/commands/validators/complete-to-do.validator';

jest.mock('@domain');
jest.mock('../../src/commands/validators/complete-to-do.validator');

describe('CompleteToDoUseCase', () => {
  it('should complete a to-do and update the repository', async () => {
    // Arrange
    const expectedToDoId = 'bb13f8c7-33cb-499c-a9c8-a9e7ef2715a9';
    const aggregate = new domain.ToDoAggregate();
    const repository = {
      update: jest.fn(),
    } as unknown as ToDosBaseRepository;
    const commandInput = {
      toDoId: 'bb13f8c7-33cb-499c-a9c8-a9e7ef2715a9',
    } as CompleteToDoCommandInput;
    jest.spyOn(domain, 'ToDoIdValueObject').mockImplementation(
      id =>
        ({
          value: id,
        }) as unknown as domain.ToDoIdValueObject
    );
    jest.spyOn(validator, 'CompleteToDoValidator');
    jest
      .spyOn(validator.CompleteToDoValidator.prototype, 'validate')
      .mockReturnValue();
    jest.spyOn(aggregate, 'completeToDo').mockReturnValue({
      toDoId: {
        value: 'bb13f8c7-33cb-499c-a9c8-a9e7ef2715a9',
      },
      completed: {
        value: true,
      },
    } as domain.ToDo);
    jest.spyOn(repository, 'update').mockResolvedValue({
      toDoId: 'bb13f8c7-33cb-499c-a9c8-a9e7ef2715a9',
      isCompleted: true,
    } as ToDoModel);

    // Act
    const useCase = new CompleteToDoUseCase(aggregate, repository);
    await useCase.execute(commandInput);

    // Assert
    expect(domain.ToDoIdValueObject).toHaveBeenCalledWith(expectedToDoId);
    expect(validator.CompleteToDoValidator).toHaveBeenCalledWith({
      toDoId: { value: expectedToDoId },
    });
    expect(aggregate.completeToDo).toHaveBeenCalledWith({
      toDoId: { value: expectedToDoId },
    });
    expect(repository.update).toHaveBeenCalledWith(expectedToDoId, {
      isCompleted: true,
    });
  });
});
