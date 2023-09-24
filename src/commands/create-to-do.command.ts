import {
  ToDoDescriptionValueObject,
  ToDoIdValueObject,
  ToDoTitleValueObject,
  UserIdValueObject,
} from '@domain';

export interface CreateToDoCommand {
  toDoId?: ToDoIdValueObject;
  userId: UserIdValueObject;
  title: ToDoTitleValueObject;
  description?: ToDoDescriptionValueObject;
}
