import { UserIdValueObject } from '@domain';
import {
  GetAllToDosCommand,
  GetAllToDosCommandInput,
  GetAllToDosValidator,
} from '../commands';
import { ToDoModel, ToDosBaseRepository } from '../persistence';
import { UseCaseBase } from './base';

export class GetAllToDosUseCase extends UseCaseBase {
  constructor(private readonly toDoRepository: ToDosBaseRepository) {
    super(null);
  }

  execute(getAllToDosCommand: GetAllToDosCommandInput): Promise<ToDoModel[]> {
    const valueObjects = this.mapToValueObjects(getAllToDosCommand);
    this.validateCommand(valueObjects);

    return this.toDoRepository.findAll({
      where: {
        userId: valueObjects.userId.value,
      },
    });
  }

  private validateCommand(command: GetAllToDosCommand): void {
    const validator = new GetAllToDosValidator(command);
    validator.validate();
  }

  private mapToValueObjects(
    completeCommand: GetAllToDosCommandInput
  ): GetAllToDosCommand {
    return {
      userId: new UserIdValueObject(completeCommand.userId),
    };
  }
}
