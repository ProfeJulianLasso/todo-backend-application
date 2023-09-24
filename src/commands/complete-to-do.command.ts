import { ToDoIdValueObject } from '@domain';

export interface CompleteToDoCommand {
  toDoId: ToDoIdValueObject;
}
