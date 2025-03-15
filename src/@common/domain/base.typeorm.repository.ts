import { BaseRepository } from './base.repository';
import { Order } from './order.interface';
import { FindPagination, Paginated } from './pagination.interface';
import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindOptionsOrder,
  Repository,
} from 'typeorm';

@Injectable()
export class BaseTypeormRepository<
  TEntity extends object,
  TCreate extends object,
  TFind extends object,
  TTypeormEntity extends TEntity,
  TRelations extends string[] = [],
> implements BaseRepository<TEntity, TCreate, TFind, TRelations>
{
  protected readonly ormRepository: Repository<TTypeormEntity>;

  constructor(
    protected readonly dataSource: DataSource,
    protected readonly TypeormEntity: EntityTarget<TTypeormEntity>,
  ) {
    this.ormRepository =
      dataSource.getRepository<TTypeormEntity>(TypeormEntity);
  }

  public async create(data: TCreate): Promise<TEntity> {
    const entity = this.ormRepository.create(
      data as unknown as DeepPartial<TTypeormEntity>,
    );
    await this.ormRepository.save(entity);
    return entity;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async find(
    data: TFind | TFind[],
    relations?: TRelations,
  ): Promise<TEntity | null> {
    const entity = await this.ormRepository.findOne({
      where: data,
      relations,
    });
    if (!entity) return null;
    return entity;
  }

  public async findMany(
    data: TFind,
    relations?: TRelations,
  ): Promise<TEntity[]> {
    const entity = await this.ormRepository.find({
      where: data,
      relations,
    });
    return entity;
  }

  public async findManyWithPagination({
    data,
    order,
    pagination,
  }: {
    data: TFind | TFind[];
    pagination?: FindPagination;
    order?: Order<TEntity>;
  }): Promise<Paginated<TEntity>> {
    const [items, total] = await this.ormRepository.findAndCount({
      where: data,
      take: pagination?.limit,
      skip: pagination ? (pagination.page - 1) * pagination.limit : 0,
      order: order as unknown as FindOptionsOrder<TTypeormEntity>,
    });

    return {
      items,
      total,
    };
  }

  public async save(entity: TEntity): Promise<TEntity> {
    return await this.ormRepository.save(
      entity as unknown as DeepPartial<TTypeormEntity>,
    );
  }

  public async softDelete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
