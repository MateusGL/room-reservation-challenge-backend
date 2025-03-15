export type Order<T> = {
  [k in keyof T]?: 'DESC' | 'ASC';
};
