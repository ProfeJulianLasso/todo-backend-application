import { UserEmailValueObject, UserPasswordValueObject } from '@domain';
import { LoginCommand, LoginCommandInput, LoginValidator } from '../commands';
import { AppConfig, ConfigEnum, Jwt, JwtDataUserInterface } from '../common';
import { UserModel, UsersBaseRepository } from '../persistence';
import { UseCaseBase } from './base';

export class LoginUseCase extends UseCaseBase {
  constructor(
    private readonly config: AppConfig,
    private readonly userRepository: UsersBaseRepository
  ) {
    super(null);
  }

  async execute(loginCommand: LoginCommandInput): Promise<string> {
    const valueObjects = this.mapToValueObjects(loginCommand);
    this.validateCommand(valueObjects);

    const data = await this.getUserByEmailAndPassword(
      valueObjects.email.value,
      valueObjects.password.hashed
    );

    return this.generateToken(data);
  }

  private generateToken(user: UserModel): string {
    const date = Date.now();
    const hours =
      1000 *
      60 *
      60 *
      (this.config.get<number>(ConfigEnum.JWT_EXPIRES_IN) ?? 1);
    const jwt = new Jwt<JwtDataUserInterface>({
      secret: this.config.get<string>(ConfigEnum.JWT_SECRET),
      payload: {
        sub: user.userId,
        iat: date,
        exp: date + hours,
        data: {
          name: user.fullName,
          email: user.email,
        },
      },
    });
    return jwt.signedToken;
  }

  private async getUserByEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserModel> {
    try {
      const user = await this.userRepository.findOneBy({
        where: { email, password },
      });
      return user;
    } catch (error) {
      throw new Error('Error on get user by email and password');
    }
  }

  private mapToValueObjects(loginCommand: LoginCommandInput): LoginCommand {
    return {
      email: new UserEmailValueObject(loginCommand.email),
      password: new UserPasswordValueObject(loginCommand.password),
    };
  }

  private validateCommand(command: LoginCommand): void {
    const validator = new LoginValidator(command);
    validator.validate();
  }
}
