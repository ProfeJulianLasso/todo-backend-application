export interface PayloadInterface<Data> {
  sub: string;
  iat: number;
  exp: number;
  data: Data;
}
