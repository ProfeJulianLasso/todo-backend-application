import * as domain from '@domain';
import {
  GetAllToDosCommandInput,
  GetAllToDosUseCase,
  GetAllToDosValidator,
  ToDosBaseRepository,
} from '../../src';

jest.mock('@domain');
jest.mock('../../src/commands/validators/get-all-to-dos.validator');

describe('GetAllToDosUseCase', () => {
  it('should return all to-dos from a user', async () => {
    // Arrange
    const expectedUserId = '20711bf2-4f36-4d74-86bc-9869260e1d4e';
    const command = {
      userId: '20711bf2-4f36-4d74-86bc-9869260e1d4e',
    } as GetAllToDosCommandInput;
    const repository = {
      findAll: jest.fn(),
    } as unknown as ToDosBaseRepository;
    jest.spyOn(domain, 'UserIdValueObject').mockImplementation(
      userId =>
        ({
          value: userId,
        }) as unknown as domain.UserIdValueObject
    );
    jest.spyOn(GetAllToDosValidator.prototype, 'validate').mockReturnValue();
    jest.spyOn(repository, 'findAll').mockResolvedValue([]);

    // Act
    const useCase = new GetAllToDosUseCase(repository);
    await useCase.execute(command);

    // Assert
    expect(domain.UserIdValueObject).toHaveBeenCalledWith(expectedUserId);
    expect(GetAllToDosValidator).toHaveBeenCalledWith({
      userId: { value: expectedUserId },
    });
    expect(GetAllToDosValidator.prototype.validate).toHaveBeenCalled();
    expect(repository.findAll).toHaveBeenCalledWith({
      where: {
        userId: expectedUserId,
      },
    });
  });
});
