export interface CreateToDoCommandInput {
  userId: string;
  title: string;
  toDoId?: string;
  description?: string;
}
