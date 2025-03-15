export type FindPagination = {
  limit: number;
  page: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
};
