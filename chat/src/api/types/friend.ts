import { LoginRequest } from "./auth";

export type AddFriendRequest = LoginRequest & {
  friendUsername: string;
};
