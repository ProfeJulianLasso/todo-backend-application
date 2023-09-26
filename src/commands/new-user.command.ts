import {
  UserEmailValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
} from '@domain';

export interface NewUserCommand {
  name: UserNameValueObject;
  email: UserEmailValueObject;
  password: UserPasswordValueObject;
}
