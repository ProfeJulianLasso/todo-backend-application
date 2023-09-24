import {
  ToDoAggregate,
  ToDoDescriptionValueObject,
  ToDoIdValueObject,
  ToDoTitleValueObject,
  User,
  UserIdValueObject,
} from '@domain';
import {
  CreateToDoCommand,
  CreateToDoCommandInput,
  CreateToDoValidator,
} from '../commands';
import { ToDoModel, ToDosBaseRepository } from '../persistence';
import { UseCaseBase } from './base';

export class CreateToDoUseCase extends UseCaseBase<ToDoAggregate> {
  constructor(
    protected readonly aggregate: ToDoAggregate,
    private readonly toDoRepository: ToDosBaseRepository
  ) {
    super(aggregate);
  }

  execute(createToDoCommand: CreateToDoCommandInput): Promise<ToDoModel> {
    const valueObjects = this.mapToValueObjects(createToDoCommand);
    this.validateCommand(valueObjects);

    const newToDo = this.aggregate.createToDo({
      toDoId: valueObjects.toDoId,
      title: valueObjects.title,
      description: valueObjects.description,
      user: new User({ userId: valueObjects.userId }),
    });
    return this.toDoRepository.create({
      toDoId: newToDo.toDoId.value,
      userId: newToDo.user.userId.value,
      title: newToDo.title.value,
      description: newToDo.description?.value,
      isCompleted: newToDo.completed.value,
      status: newToDo.status.value,
    } as ToDoModel);
  }

  private validateCommand(command: CreateToDoCommand): void {
    const validator = new CreateToDoValidator(command);
    validator.validate();
  }

  private mapToValueObjects(
    loginCommand: CreateToDoCommandInput
  ): CreateToDoCommand {
    return {
      userId: new UserIdValueObject(loginCommand.userId),
      title: new ToDoTitleValueObject(loginCommand.title),
      description: loginCommand.description
        ? new ToDoDescriptionValueObject(loginCommand.description)
        : undefined,
      toDoId: loginCommand.toDoId
        ? new ToDoIdValueObject(loginCommand.toDoId)
        : undefined,
    };
  }
}
