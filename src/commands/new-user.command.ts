import {
  UserEmailValueObject,
  UserIdValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
} from '@domain';

export interface NewUserCommand {
  userId?: UserIdValueObject;
  name: UserNameValueObject;
  email: UserEmailValueObject;
  password: UserPasswordValueObject;
}
