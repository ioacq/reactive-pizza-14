export enum OperationType {
  Create = "Create",
  Read = "Read",
  Update = "Update",
  Delete = "Delete",
}

export interface Operation<T> {
  type: OperationType;
  model: T
}