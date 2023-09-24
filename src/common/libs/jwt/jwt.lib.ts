import * as crypto from 'node:crypto';
import { JwtHeaderInterface, PayloadInterface } from './interface';
import { JwtInterface } from './interface/jwt.interface';

export class Jwt<Data> {
  private readonly HASH_ALGORITHM = 'sha256';
  private readonly ENCODE_DECODE_ALGORITHM = 'base64';
  private readonly SIGNATURE_ALGORITHM = 'HS256';
  private readonly TOKEN_TYPE = 'JWT';
  private readonly ENCODING = 'utf-8';
  private readonly HEADER = {
    alg: this.SIGNATURE_ALGORITHM,
    typ: this.TOKEN_TYPE,
  } as JwtHeaderInterface;
  private readonly _headerBase64: string;
  private _payloadBase64: string;
  private _token: string;
  private _signature: string;
  private _signedToken: string;

  constructor({ payload, secret }: JwtInterface<Data>) {
    this._headerBase64 = this.createHeader();
    if (payload) {
      this._payloadBase64 = this.encodePayload(payload);
      this._token = this.createToken({});
    } else {
      this._payloadBase64 = '';
      this._token = '';
    }
    if (secret) this._signature = this.createSignature(secret);
    else this._signature = '';
    if (payload && secret) this._signedToken = this.signToken();
    else this._signedToken = '';
  }

  get signedToken(): string {
    return this._signedToken;
  }

  getPayloadData(token: string): PayloadInterface<Data> {
    const { payloadBase64 } = this.splitToken(token);
    if (!payloadBase64) {
      throw new Error('Invalid token');
    }

    try {
      const payload = JSON.parse(
        Buffer.from(payloadBase64, this.ENCODE_DECODE_ALGORITHM).toString(
          this.ENCODING
        )
      ) as PayloadInterface<Data>;
      return payload;
    } catch (error: unknown) {
      throw new Error('Error decoding token payload: ' + error);
    }
  }

  verifyToken(token: string, secret: string): boolean {
    const { headerBase64, payloadBase64, signature } = this.splitToken(token);
    const { header, payload } = this.decodePayloadAndHeader(
      headerBase64,
      payloadBase64
    );
    if (!this.verifySignatureAlgorithm(header)) {
      throw new Error('Invalid signature algorithm');
    }
    const unsignedToken = this.createToken({ headerBase64, payloadBase64 });
    const expectedSignature = this.calculateExpectedSignature(
      unsignedToken,
      secret
    );

    if (signature !== expectedSignature) throw new Error('Invalid signature');
    if (payload.exp < Date.now() / 1000) throw new Error('Token expired');

    return true;
  }

  private splitToken(token: string): {
    headerBase64: string;
    payloadBase64: string;
    signature: string;
  } {
    const [headerBase64, payloadBase64, signature] = token.split('.');
    return { headerBase64, payloadBase64, signature };
  }

  private calculateExpectedSignature(
    unsignedToken: string,
    secret: string
  ): string {
    return crypto
      .createHmac(this.HASH_ALGORITHM, secret)
      .update(unsignedToken)
      .digest(this.ENCODE_DECODE_ALGORITHM);
  }

  private verifySignatureAlgorithm(header: JwtHeaderInterface): boolean {
    return header.alg === this.SIGNATURE_ALGORITHM;
  }

  private createHeader(): string {
    return Buffer.from(JSON.stringify(this.HEADER)).toString(
      this.ENCODE_DECODE_ALGORITHM
    );
  }

  private encodePayload(payload: PayloadInterface<Data>): string {
    return Buffer.from(JSON.stringify(payload)).toString(
      this.ENCODE_DECODE_ALGORITHM
    );
  }

  private createToken({
    headerBase64,
    payloadBase64,
  }: {
    headerBase64?: string;
    payloadBase64?: string;
  }): string {
    if (!headerBase64) headerBase64 = this._headerBase64;
    if (!payloadBase64) payloadBase64 = this._payloadBase64;
    return `${headerBase64}.${payloadBase64}`;
  }

  private decodePayloadAndHeader(
    headerBase64: string,
    payloadBase64: string
  ): { header: JwtHeaderInterface; payload: PayloadInterface<Data> } {
    const header = JSON.parse(
      Buffer.from(headerBase64, this.ENCODE_DECODE_ALGORITHM).toString(
        this.ENCODING
      )
    ) as JwtHeaderInterface;
    const payload = JSON.parse(
      Buffer.from(payloadBase64, this.ENCODE_DECODE_ALGORITHM).toString(
        this.ENCODING
      )
    ) as PayloadInterface<Data>;

    return { header, payload };
  }

  private createSignature(secret: string): string {
    return crypto
      .createHmac(this.HASH_ALGORITHM, secret)
      .update(this._token)
      .digest(this.ENCODE_DECODE_ALGORITHM);
  }

  private signToken(): string {
    return `${this._token}.${this._signature}`;
  }
}
