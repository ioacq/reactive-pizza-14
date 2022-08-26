import { Pagination } from './pagination';
import { Operation } from './operation';

export interface State<T> {
  records: T[];
  pagination: Pagination;
  operation?: Operation<T>;
  loading: boolean;
  counter: number; // To trigger view render
}