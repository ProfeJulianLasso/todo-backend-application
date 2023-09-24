import { ToDoIdValueObject } from '@domain';
import { ApplicationException } from '../../common';
import { CompleteToDoCommand } from '../complete-to-do.command';
import { ValidatorBase } from './base';

export class CompleteToDoValidator extends ValidatorBase {
  toDoId: ToDoIdValueObject;

  constructor(private readonly data: CompleteToDoCommand) {
    super();
    this.toDoId = data.toDoId;
  }

  validate(): void {
    if (!this.toDoId.isValid()) this.error = this.toDoId.error;
    if (!this.isValid())
      throw new ApplicationException('Invalid data', this.getErrors());
  }
}
