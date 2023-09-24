import { ToDoAggregate, ToDoIdValueObject } from '@domain';
import {
  CompleteToDoCommand,
  CompleteToDoCommandInput,
  CompleteToDoValidator,
} from '../commands';
import { ToDoModel, ToDosBaseRepository } from '../persistence';
import { UseCaseBase } from './base';

export class CompleteToDoUseCase extends UseCaseBase<ToDoAggregate> {
  constructor(
    protected readonly aggregate: ToDoAggregate,
    private readonly toDoRepository: ToDosBaseRepository
  ) {
    super(aggregate);
  }

  execute(completeToDoCommand: CompleteToDoCommandInput): Promise<ToDoModel> {
    const valueObjects = this.mapToValueObjects(completeToDoCommand);
    this.validateCommand(valueObjects);

    const completedToDo = this.aggregate.completeToDo({
      toDoId: valueObjects.toDoId,
    });
    return this.toDoRepository.update(valueObjects.toDoId.value, {
      isCompleted: completedToDo.completed.value,
    } as ToDoModel);
  }

  private validateCommand(command: CompleteToDoCommand): void {
    const validator = new CompleteToDoValidator(command);
    validator.validate();
  }

  private mapToValueObjects(
    completeCommand: CompleteToDoCommandInput
  ): CompleteToDoCommand {
    return {
      toDoId: new ToDoIdValueObject(completeCommand.toDoId),
    };
  }
}
