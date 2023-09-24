import { DocumentBase } from './base';
import { ToDoModel } from './to-do.mode';

export interface UserModel extends DocumentBase {
  userId: string;
  fullName: string;
  email: string;
  password: string;
  toDos?: ToDoModel[];
}
