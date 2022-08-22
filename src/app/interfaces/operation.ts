export enum OperationType {
  Create,
  Read,
  Update,
  Delete
}

export interface Operation<T> {
  type: OperationType;
  model: T
}