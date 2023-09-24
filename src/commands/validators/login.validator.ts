import { UserEmailValueObject, UserPasswordValueObject } from '@domain';
import { ApplicationException } from '../../common';
import { LoginCommand } from '../login.command';
import { ValidatorBase } from './base';

export class LoginValidator extends ValidatorBase {
  email: UserEmailValueObject;
  password: UserPasswordValueObject;

  constructor(private readonly data: LoginCommand) {
    super();
    this.email = data.email;
    this.password = data.password;
  }

  validate(): void {
    if (!this.email.isValid()) this.error = this.email.error;
    if (!this.isValid())
      throw new ApplicationException('Invalid data', this.getErrors());
  }
}
