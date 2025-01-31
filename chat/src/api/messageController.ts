import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { chatAxios } from "../config/axios.config";
import { useGlobal } from "../hooks/GlobalContext";
import { useMutationRequest } from "../hooks/useQueryRequest";
import { Endpoints, QueryKeys } from "./endpoints";
import { LoginRequest } from "./types/auth";
import { MessageDto, MessageRequest } from "./types/messages";

const getAllFriendsMessages = async (
  username: string,
  request: LoginRequest
): Promise<MessageDto[]> => {
  const params = qs.stringify(request);
  const response = await chatAxios.get(
    `${Endpoints.friendsMessages(username)}?${params}`
  );

  return response.data as MessageDto[];
};

export const useGetAllFriendsMessagesQuery = (username: string) => {
  const { loggedInUser } = useGlobal();

  return useQuery({
    queryKey: QueryKeys.friendsMessages(username),
    queryFn: () =>
      getAllFriendsMessages(username, {
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      }),
    refetchInterval: 2500,
  });
};

const sendFriendMessage = async (
  username: string,
  request: MessageRequest
): Promise<void> => {
  await chatAxios.post(Endpoints.friendsMessages(username), request);
};

export const useSendFriendMessageMutation = (username: string) => {
  const { loggedInUser } = useGlobal();

  return useMutationRequest({
    func: (message: string) => {
      return sendFriendMessage(username, {
        message: message,
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      });
    },
    invalidateKeys: [QueryKeys.friendsMessages(username)],
  });
};

const getAllChannelMessages = async (
  id: number,
  request: LoginRequest
): Promise<MessageDto[]> => {
  const params = qs.stringify(request);
  const response = await chatAxios.get(
    `${Endpoints.channelMessages(id)}?${params}`
  );

  return response.data as MessageDto[];
};

export const useGetAllChannelMessagesQuery = (id: number) => {
  const { loggedInUser } = useGlobal();

  return useQuery({
    queryKey: QueryKeys.channelMessages(id),
    queryFn: () =>
      getAllChannelMessages(id, {
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      }),
    refetchInterval: 2500,
  });
};

const sendChannelMessage = async (
  id: number,
  request: MessageRequest
): Promise<void> => {
  await chatAxios.post(Endpoints.channelMessages(id), request);
};

export const useSendChannelMessageMutation = (id: number) => {
  const { loggedInUser } = useGlobal();

  return useMutationRequest({
    func: (message: string) => {
      return sendChannelMessage(id, {
        message: message,
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      });
    },
    invalidateKeys: [QueryKeys.channelMessages(id)],
  });
};
