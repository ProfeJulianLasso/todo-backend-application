import { AppConfig } from '../../../src';

describe('AppConfig', () => {
  let config: AppConfig;

  beforeEach(() => {
    config = AppConfig.instance;
  });

  it('should return undefined for non-existent keys', () => {
    // Arrange

    // Act
    const data = config.get('NON_EXISTENT_KEY');

    // Assert
    expect(data).toBeUndefined();
  });

  it('should return the correct value for existing keys', () => {
    // Arrange
    process.env.EXISTING_KEY = 'EXISTING_VALUE';
    const expected = 'EXISTING_VALUE';

    // Act
    const data = config.get('EXISTING_KEY');

    // Assert
    expect(data).toBe(expected);
  });
});
