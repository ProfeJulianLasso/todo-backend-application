import { UserEmailValueObject, UserPasswordValueObject } from '@domain';

export interface LoginCommand {
  email: UserEmailValueObject;
  password: UserPasswordValueObject;
}
