import {
  SecurityAggregate,
  UserEmailValueObject,
  UserIdValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
} from '@domain';
import {
  CreateUserCommandInput,
  NewUserCommand,
  NewUserValidator,
} from '../commands';
import { UserModel, UsersBaseRepository } from '../persistence';
import { UseCaseBase } from './base';

export class CreateUserUseCase extends UseCaseBase<SecurityAggregate> {
  constructor(
    protected readonly aggregate: SecurityAggregate,
    private readonly userRepository: UsersBaseRepository
  ) {
    super(aggregate);
  }

  execute(userCreateCommand: CreateUserCommandInput): Promise<UserModel> {
    const valueObjects = this.mapToValueObjects(userCreateCommand);
    this.validateCommand(valueObjects);

    const newUser = this.aggregate.createUser(valueObjects);
    return this.userRepository.create({
      userId: newUser.userId.value,
      fullName: newUser.name.value,
      email: newUser.email.value,
      password: newUser.password.hashed,
      status: newUser.status.value,
    } as UserModel);
  }

  private validateCommand(command: NewUserCommand): void {
    const validator = new NewUserValidator(command);
    validator.validate();
  }

  private mapToValueObjects(
    loginCommand: CreateUserCommandInput
  ): NewUserCommand {
    return {
      userId: loginCommand.id
        ? new UserIdValueObject(loginCommand.id)
        : undefined,
      name: new UserNameValueObject(loginCommand.name),
      email: new UserEmailValueObject(loginCommand.email),
      password: new UserPasswordValueObject(loginCommand.password),
    };
  }
}
