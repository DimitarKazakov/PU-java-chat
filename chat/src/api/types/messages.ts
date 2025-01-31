import { LoginRequest } from "./auth";

export type MessageDto = {
  message: string;
  senderUsername: string;
  senderEmail: string;
  createdAt: string;
};

export type MessageRequest = LoginRequest & {
  message: string;
};
