import * as domain from '@domain';
import {
  AppConfig,
  ApplicationException,
  ConfigEnum,
  LoginCommandInput,
  LoginUseCase,
  PersistenceException,
  UserModel,
  UsersBaseRepository,
} from '../../src';
import * as validator from '../../src/commands/validators/login.validator';
import * as jwt from '../../src/common/libs/jwt/jwt.lib';

jest.mock('@domain');
jest.mock('../../src/common/libs/jwt/jwt.lib');
jest.mock('../../src/commands/validators/login.validator');

jest
  .useFakeTimers({
    now: Date.now(),
  })
  .setSystemTime(new Date('2021-04-25T12:22:55.047Z').getTime());

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let config: AppConfig;
  let repository: UsersBaseRepository;

  beforeEach(() => {
    config = {
      get: jest.fn(),
    } as unknown as AppConfig;

    repository = {
      findOneBy: jest.fn(),
    } as unknown as UsersBaseRepository;

    loginUseCase = new LoginUseCase(config, repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should generate a token for a valid user', async () => {
      // Arrange
      const email = 'john.doe@example.com';
      const expectedEmail = 'john.doe@example.com';
      const password = 'password';
      const expectedPassword = 'password';
      const hashedPassword =
        '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
      const expectedHashedPassword =
        '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
      const expectedSecret = 'secret';
      const loginCommand = { email, password } as LoginCommandInput;
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
            hashed: hashedPassword,
          }) as unknown as domain.UserPasswordValueObject
      );
      jest.spyOn(validator, 'LoginValidator');
      jest.spyOn(config, 'get').mockImplementation(key => {
        if (key === ConfigEnum.JWT_EXPIRES_IN) {
          return 1;
        }
        if (key === ConfigEnum.JWT_SECRET) {
          return 'secret';
        }
        return null;
      });
      jest
        .spyOn(validator.LoginValidator.prototype, 'validate')
        .mockReturnValue();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue({
        userId: '7b280324-d62e-4b1c-b4ce-b6724bb4cd83',
        fullName: 'John Doe',
        email,
        password,
      } as UserModel);
      jest.spyOn(jwt, 'Jwt').mockImplementation(
        () =>
          ({
            signedToken: 'mocked-token',
          }) as unknown as jwt.Jwt<{}>
      );

      // Act
      await loginUseCase.execute(loginCommand);

      // Assert
      expect(loginUseCase).toBeDefined();
      expect(domain.UserEmailValueObject).toHaveBeenCalledWith(expectedEmail);
      expect(domain.UserPasswordValueObject).toHaveBeenCalledWith(
        expectedPassword
      );
      expect(validator.LoginValidator).toHaveBeenCalledWith({
        email: { value: expectedEmail },
        password: { value: expectedPassword, hashed: expectedHashedPassword },
      });
      expect(config.get).toHaveBeenCalledWith(ConfigEnum.JWT_EXPIRES_IN);
      expect(config.get).toHaveBeenCalledWith(ConfigEnum.JWT_SECRET);
      expect(validator.LoginValidator.prototype.validate).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalledWith({
        where: { email: expectedEmail, password: expectedHashedPassword },
      });
      expect(jwt.Jwt).toHaveBeenCalledWith({
        secret: expectedSecret,
        payload: {
          sub: '7b280324-d62e-4b1c-b4ce-b6724bb4cd83',
          iat: 1619353375047,
          exp: 1619356975047,
          data: {
            name: 'John Doe',
            email: expectedEmail,
          },
        },
      });
    });
  });

  it('should throw an exception type ApplicationException', async () => {
    // Arrange
    const expectedError = new ApplicationException('Invalid credentials');
    const email = 'john.doe@example.com';
    const password = 'password';
    const hashedPassword =
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
    const loginCommand = { email, password } as LoginCommandInput;
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
          hashed: hashedPassword,
        }) as unknown as domain.UserPasswordValueObject
    );
    jest.spyOn(validator, 'LoginValidator');
    jest
      .spyOn(validator.LoginValidator.prototype, 'validate')
      .mockReturnValue();
    jest.spyOn(repository, 'findOneBy').mockImplementation(() => {
      throw new PersistenceException('Data not found', {
        message: 'Data not found',
      });
    });

    // Act
    const applicationException = async () => loginUseCase.execute(loginCommand);

    // Assert
    await expect(applicationException).rejects.toThrow(expectedError);
    await expect(applicationException).rejects.toThrow(expectedError.message);
  });

  it('should raise an exception of any type', async () => {
    // Arrange
    const expectedError = new Error('Unexpected error');
    const email = 'john.doe@example.com';
    const password = 'password';
    const hashedPassword =
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
    const loginCommand = { email, password } as LoginCommandInput;
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
          hashed: hashedPassword,
        }) as unknown as domain.UserPasswordValueObject
    );
    jest.spyOn(validator, 'LoginValidator');
    jest
      .spyOn(validator.LoginValidator.prototype, 'validate')
      .mockReturnValue();
    jest.spyOn(repository, 'findOneBy').mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    // Act
    const applicationException = async () => loginUseCase.execute(loginCommand);

    // Assert
    await expect(applicationException).rejects.toThrow(expectedError);
    await expect(applicationException).rejects.toThrow(expectedError.message);
  });
});
