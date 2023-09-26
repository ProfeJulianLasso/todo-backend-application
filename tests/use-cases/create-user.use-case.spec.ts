import * as domain from '@domain';
import {
  CreateUserCommandInput,
  CreateUserUseCase,
  NewUserValidator,
  UserModel,
  UsersBaseRepository,
} from '../../src';

jest.mock('@domain');
jest.mock('../../src/commands/validators/new-user.validator');

describe('Create User Use Case', () => {
  it('should create a new user and return the user model', async () => {
    // Arrange
    const aggregate = new domain.SecurityAggregate();
    const repository = {
      create: jest.fn(),
    } as unknown as UsersBaseRepository;
    const command = {
      name: 'User Name',
      email: 'user.name@domain.com',
      password: '123456',
    } as CreateUserCommandInput;
    jest.spyOn(domain, 'UserNameValueObject').mockImplementation(
      name =>
        ({
          value: name,
        }) as unknown as domain.UserNameValueObject
    );
    jest.spyOn(domain, 'UserEmailValueObject').mockImplementation(
      email =>
        ({
          value: email,
        }) as unknown as domain.UserEmailValueObject
    );
    jest.spyOn(domain, 'UserPasswordValueObject').mockImplementation(
      password =>
        ({
          value: password,
        }) as unknown as domain.UserPasswordValueObject
    );
    jest.spyOn(NewUserValidator.prototype, 'validate').mockReturnValue();
    jest.spyOn(aggregate, 'createUser').mockReturnValue({
      userId: { value: '123456' },
      name: { value: 'User Name' },
      email: { value: 'user.name@domain.com' },
      password: {
        hashed:
          '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
      },
      status: { value: true },
    } as domain.User);

    // Act
    const useCase = new CreateUserUseCase(aggregate, repository);
    await useCase.execute(command);

    // Assert
    expect(domain.UserNameValueObject).toHaveBeenCalledWith(command.name);
    expect(domain.UserEmailValueObject).toHaveBeenCalledWith(command.email);
    expect(domain.UserPasswordValueObject).toHaveBeenCalledWith(
      command.password
    );
    expect(NewUserValidator).toHaveBeenCalledWith({
      name: { value: command.name },
      email: { value: command.email },
      password: { value: command.password },
    });
    expect(NewUserValidator.prototype.validate).toHaveBeenCalled();
    expect(aggregate.createUser).toHaveBeenCalledWith({
      name: { value: command.name },
      email: { value: command.email },
      password: { value: command.password },
    });
    expect(repository.create).toHaveBeenCalledWith({
      userId: '123456',
      fullName: 'User Name',
      email: 'user.name@domain.com',
      password:
        '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
      status: true,
    } as UserModel);
  });
});
