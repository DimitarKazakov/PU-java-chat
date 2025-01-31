import { LoginRequest } from "./auth";

export type ChannelRolesEnum = "OWNER" | "ADMIN" | "GUEST";

export type UserChannelDto = {
  id: number;
  username: string;
  email: string;
  role: ChannelRolesEnum;
};

export type ChannelDto = {
  id: number;
  name: string;
  createdAt: string;
  users: UserChannelDto[];
};

export type StoreChannelRequest = LoginRequest & {
  name: string;
};

export type EditChannelMemberRequest = LoginRequest & {
  username: string;
};

export type EditChannelMemberRoleRequest = LoginRequest & {
  username: string;
  role: ChannelRolesEnum;
};
