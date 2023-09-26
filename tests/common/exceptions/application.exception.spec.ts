import { ApplicationException } from '../../../src';

describe('ApplicationException', () => {
  it('should create an instance with message and details', () => {
    // Arrange
    const message = 'Test message';
    const details = { key: 'value' };
    const expectedMessage = 'Test message';
    const expectedDetails = { key: 'value' };

    // Act
    const exception = new ApplicationException(message, details);

    // Assert
    expect(exception.message).toBe(expectedMessage);
    expect(exception.details).toEqual(expectedDetails);
  });

  it('should create an instance with message only', () => {
    // Arrange
    const message = 'Test message';
    const expectedMessage = 'Test message';

    // Act
    const exception = new ApplicationException(message);

    // Assert
    expect(exception.message).toBe(expectedMessage);
    expect(exception.details).toBeUndefined();
  });
});
