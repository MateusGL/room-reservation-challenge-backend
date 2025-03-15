import { Order } from './order.interface';
import { FindPagination, Paginated } from './pagination.interface';

export class BaseRepository<TEntity, TCreate, TFind, TRelations = []> {
  create: (data: TCreate) => Promise<TEntity>;
  delete: (id: string) => Promise<void>;
  find: (
    data: TFind | TFind[],
    relations?: TRelations,
  ) => Promise<TEntity | null>;
  findMany: (data: TFind, relations?: TRelations) => Promise<TEntity[]>;
  findManyWithPagination: (params: {
    data: TFind | TFind[];
    pagination?: FindPagination;
    order?: Order<TEntity>;
  }) => Promise<Paginated<TEntity>>;
  save: (entity: TEntity) => Promise<TEntity>;
  softDelete: (id: string) => Promise<void>;
}
