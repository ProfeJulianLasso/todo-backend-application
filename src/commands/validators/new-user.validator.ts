import {
  UserEmailValueObject,
  UserIdValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
} from '@domain';
import { ApplicationException } from '../../common';
import { NewUserCommand } from '../new-user.command';
import { ValidatorBase } from './base';

export class NewUserValidator extends ValidatorBase {
  userId?: UserIdValueObject;
  name: UserNameValueObject;
  email: UserEmailValueObject;
  password: UserPasswordValueObject;

  constructor(private readonly data: NewUserCommand) {
    super();
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }

  validate(): void {
    if (!this.name.isValid()) this.error = this.name.error;
    if (!this.email.isValid()) this.error = this.email.error;
    if (!this.password.isValid()) this.error = this.password.error;
    if (!this.isValid())
      throw new ApplicationException('Invalid data', this.getErrors());
  }
}
