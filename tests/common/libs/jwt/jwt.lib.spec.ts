import { Jwt, PayloadInterface } from '../../../../src';

jest
  .useFakeTimers({ now: Date.now() })
  .setSystemTime(new Date('2021-08-01 10:32:58').getTime());

interface MyDataInterface {
  id: number;
  name: string;
}

describe('Jwt', () => {
  let payload: PayloadInterface<MyDataInterface>;
  let secret: string;
  let validToken: string;

  beforeAll(() => {
    const date = Date.now();
    payload = {
      sub: '1234567890',
      iat: date,
      exp: date / 1000 + 60 * 60 * 2,
      data: {
        id: 1,
        name: 'John Doe',
      },
    };
    secret = 'my-secret';
    validToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjI3ODMxOTc4MDAwLCJleHAiOjE2Mjc4MzkxNzgsImRhdGEiOnsiaWQiOjEsIm5hbWUiOiJKb2huIERvZSJ9fQ==.ym4cYlLxgoIWV74w+wnclGK4Hw+dloMAWt51VQ+AvCk=';
  });

  it('should create a token with payload and signature', () => {
    // Arrange
    const expectedToken = `${validToken}`;

    // Act
    const jwt = new Jwt({ payload, secret });
    const token = jwt.signedToken;

    // Assert
    expect(token).toEqual(expectedToken);
  });

  it('should decode a token and return the payload data', () => {
    // Arrange
    const expectedPayload = { ...payload };

    // Act
    const jwt = new Jwt({ payload, secret });
    const token = jwt.signedToken;
    const decodedPayload = jwt.getPayloadData(token);

    // Assert
    expect(decodedPayload).toEqual(expectedPayload);
  });

  it('should verify a valid token', () => {
    // Arrange
    const expected = true;

    // Act
    const jwt = new Jwt({});
    const token = `${validToken}`;
    const isValid = jwt.verifyToken(token, secret);

    // Assert
    expect(isValid).toBe(expected);
  });

  it('should throw an error for an invalid signature algorithm', () => {
    // Arrange
    const expected = 'Invalid signature algorithm';
    const invalidToken =
      'eyJhbGciOiJpbnZhbGlkIiwidHlwIjoiSldUIn0=.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjI3ODMxOTc4MDAwLCJleHAiOjE2Mjc4MzkxNzgsImRhdGEiOnsiaWQiOjEsIm5hbWUiOiJKb2huIERvZSJ9fQ==.Asc+JCWl3HYIVTJRAo1x4AWqJwz4vRz87/HXTkuH6sY=';

    // Act
    const jwt = new Jwt({ payload, secret });
    const verifyToken = () => jwt.verifyToken(invalidToken, secret);

    // Assert
    expect(verifyToken).toThrow(expected);
  });

  it('should throw an error due to an invalid signature when they are different', () => {
    // Arrange
    const expected = 'Invalid signature';
    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjI3ODMxOTc4MDAwLCJleHAiOjE2Mjc4MzkxNzgsImRhdGEiOnsiaWQiOjEsIm5hbWUiOiJKb2huIERvZSJ9fQ==.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

    // Act
    const jwt = new Jwt({ payload, secret });
    const verifyToken = () => jwt.verifyToken(invalidToken, secret);

    // Assert
    expect(verifyToken).toThrow(expected);
  });

  it('should throw an error for an invalid token', () => {
    // Arrange
    const expected = 'Invalid token';
    const invalidToken = 'eyJhbGciOiJpbnZhbGlkIiwidHlwIjoiSldUIn0=';

    // Act
    const jwt = new Jwt({ payload, secret });
    const getPayloadData = () => jwt.getPayloadData(invalidToken);

    // Assert
    expect(getPayloadData).toThrow(expected);
  });

  it('should throw an error for an error decoding token payload', () => {
    // Arrange
    const expected = 'Error decoding token payload';
    const invalidToken =
      'eyJhbGciOiJpbnZhbGlkIiwidHlwIjoiSldUIn0=.eyJhbGciOiJpbnZhbGlkIi.eyJhbGciOiJpbnZhbGlkIiwidHlwIjoiSldUIn0=';

    // Act
    const jwt = new Jwt({ payload, secret });
    const getPayloadData = () => jwt.getPayloadData(invalidToken);

    // Assert
    expect(getPayloadData).toThrow(expected);
  });

  it('should throw an error for an expired token', () => {
    // Arrange
    const expected = 'Token expired';
    const expiredPayload = { ...payload, exp: Date.now() / 1000 - 1 };

    // Act
    const jwt = new Jwt({
      payload: expiredPayload,
      secret,
    });
    const token = jwt.signedToken;
    const exception = () => jwt.verifyToken(token, secret);

    expect(exception).toThrow(Error);
    expect(exception).toThrow(expected);
  });
});
