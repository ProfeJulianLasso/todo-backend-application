import { QueryOptionsInterface } from '../../../common';

export abstract class RepositoryBase<Entity> {
  abstract findAll(options?: QueryOptionsInterface<Entity>): Promise<Entity[]>;
  abstract findBy(options: QueryOptionsInterface<Entity>): Promise<Entity[]>;
  abstract findOneBy(options: QueryOptionsInterface<Entity>): Promise<Entity>;
  abstract create(entity: Entity): Promise<Entity>;
  abstract update(id: string, entity: Entity): Promise<Entity>;
  abstract delete(id: string, soft?: boolean): Promise<boolean>;
}
