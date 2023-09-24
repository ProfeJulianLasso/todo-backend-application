import { UserIdValueObject } from '@domain';
import { ApplicationException } from '../../common';
import { GetAllToDosCommand } from '../get-all-to-dos.command';
import { ValidatorBase } from './base';

export class GetAllToDosValidator extends ValidatorBase {
  userId: UserIdValueObject;

  constructor(private readonly data: GetAllToDosCommand) {
    super();
    this.userId = data.userId;
  }

  validate(): void {
    if (!this.userId.isValid()) this.error = this.userId.error;
    if (!this.isValid())
      throw new ApplicationException('Invalid data', this.getErrors());
  }
}
