import { UserIdValueObject } from '@domain';
import {
  ApplicationException,
  GetAllToDosCommand,
  GetAllToDosValidator,
} from '../../../src';

describe('GetAllToDosValidator', () => {
  let validUserId: UserIdValueObject;
  let invalidUserId: UserIdValueObject;

  beforeAll(() => {
    validUserId = new UserIdValueObject('10255379-37c6-4fc2-b1b8-233a7ad84213');
    invalidUserId = new UserIdValueObject('');
  });

  it('should not have errors when given valid data', () => {
    // Arrange
    const expected = true;
    const data = {
      userId: validUserId,
    } as GetAllToDosCommand;
    const validator = new GetAllToDosValidator(data);

    // Act
    validator.validate();
    const result = validator.isValid();

    // Assert
    expect(result).toBe(expected);
  });

  it('should have errors when given invalid data', () => {
    // Arrange
    const expectedMessage = 'Invalid data';
    const data = {
      userId: invalidUserId,
    } as GetAllToDosCommand;
    const validator = new GetAllToDosValidator(data);

    // Act
    const validate = () => validator.validate();

    // Assert
    expect(validate).toThrow(ApplicationException);
    expect(validate).toThrow(expectedMessage);
  });
});
