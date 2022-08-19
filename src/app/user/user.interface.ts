export interface User {
  gender: string;
  name: {
    first: string;
    last: string;
  };
}

export interface RandomUserResponse {
  results: User[];
}