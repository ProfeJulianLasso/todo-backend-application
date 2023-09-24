import { DocumentBase } from './base';

export interface ToDoModel extends DocumentBase {
  toDoId: string;
  userId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
}
