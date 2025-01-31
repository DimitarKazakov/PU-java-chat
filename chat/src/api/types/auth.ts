export type AuthUser = {
  username: string;
  password: string;
  email: string;
  createdAt: string;
  id: number;
  deleted: boolean;
};

export type LoginRequest = {
  password: string;
  email: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  email: string;
};
