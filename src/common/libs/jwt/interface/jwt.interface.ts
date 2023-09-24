import { PayloadInterface } from './payload.interface';

export interface JwtInterface<Data> {
  payload?: PayloadInterface<Data>;
  secret?: string;
}
