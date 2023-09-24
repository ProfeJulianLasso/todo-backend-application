import { UserModel } from '../models';
import { RepositoryBase } from './base';

export abstract class UsersBaseRepository extends RepositoryBase<UserModel> {}
