import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { chatAxios } from "../config/axios.config";
import { useGlobal } from "../hooks/GlobalContext";
import { useMutationRequest } from "../hooks/useQueryRequest";
import { Endpoints, QueryKeys } from "./endpoints";
import { LoginRequest } from "./types/auth";
import {
  ChannelDto,
  ChannelRolesEnum,
  EditChannelMemberRequest,
  EditChannelMemberRoleRequest,
  StoreChannelRequest,
} from "./types/channels";

const getAllChannels = async (request: LoginRequest): Promise<ChannelDto[]> => {
  const params = qs.stringify(request);
  const response = await chatAxios.get(`${Endpoints.channels}?${params}`);

  return response.data as ChannelDto[];
};

export const useGetAllChannelsQuery = () => {
  const { loggedInUser } = useGlobal();

  return useQuery({
    queryKey: QueryKeys.allChannels,
    queryFn: () =>
      getAllChannels({
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      }),
  });
};

const createChannel = async (request: StoreChannelRequest): Promise<void> => {
  await chatAxios.post(Endpoints.channels, request);
};

export const useCreateChannelMutation = () => {
  const { loggedInUser } = useGlobal();

  return useMutationRequest({
    func: (channel: string) => {
      return createChannel({
        name: channel,
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      });
    },
    invalidateKeys: [QueryKeys.allChannels],
  });
};

// Authorization - OWNERS + ADMINS
const addUserToChannel = async (
  request: EditChannelMemberRequest,
  channelId: number
): Promise<void> => {
  await chatAxios.post(Endpoints.channelMembers(channelId), request);
};

export const useAddUserToChannelMutation = () => {
  const { loggedInUser } = useGlobal();

  return useMutationRequest({
    func: (data: { channelId: number; username: string }) => {
      return addUserToChannel(
        {
          username: data.username,
          email: loggedInUser?.email ?? "",
          password: loggedInUser?.password ?? "",
        },
        data.channelId
      );
    },
    invalidateKeys: [QueryKeys.allChannels],
  });
};

// Authorization - OWNERS
const editUserChannelRole = async (
  request: EditChannelMemberRoleRequest,
  channelId: number
): Promise<void> => {
  await chatAxios.put(Endpoints.channelMembers(channelId), request);
};

export const useEditUserChannelRoleMutation = () => {
  const { loggedInUser } = useGlobal();

  return useMutationRequest({
    func: (data: {
      channelId: number;
      username: string;
      role: ChannelRolesEnum;
    }) => {
      return editUserChannelRole(
        {
          username: data.username,
          role: data.role,
          email: loggedInUser?.email ?? "",
          password: loggedInUser?.password ?? "",
        },
        data.channelId
      );
    },
    invalidateKeys: [QueryKeys.allChannels],
  });
};

// Authorization - OWNERS
const removeUserFromChannel = async (
  request: EditChannelMemberRequest,
  channelId: number
): Promise<void> => {
  await chatAxios.delete(Endpoints.channelMembers(channelId), {
    data: request,
  });
};

export const useRemoveUserFromChannelMutation = () => {
  const { loggedInUser } = useGlobal();

  return useMutationRequest({
    func: (data: { channelId: number; username: string }) => {
      return removeUserFromChannel(
        {
          username: data.username,
          email: loggedInUser?.email ?? "",
          password: loggedInUser?.password ?? "",
        },
        data.channelId
      );
    },
    invalidateKeys: [QueryKeys.allChannels],
  });
};

// Authorization - OWNERS + ADMINS
const editChannelName = async (
  channelId: number,
  request: StoreChannelRequest
): Promise<void> => {
  await chatAxios.put(Endpoints.channelName(channelId), request);
};

export const useEditChannelNameMutation = () => {
  const { loggedInUser } = useGlobal();

  return useMutationRequest({
    func: (data: { channelId: number; name: string }) => {
      return editChannelName(data.channelId, {
        name: data.name,
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      });
    },
    invalidateKeys: [QueryKeys.allChannels],
  });
};

// Authorization - OWNERS
const deleteChannel = async (
  channelId: number,
  request: LoginRequest
): Promise<void> => {
  await chatAxios.delete(Endpoints.specificChannel(channelId), {
    data: request,
  });
};

export const useDeleteChannelMutation = () => {
  const { loggedInUser } = useGlobal();

  return useMutationRequest({
    func: (channelId: number) => {
      return deleteChannel(channelId, {
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      });
    },
    invalidateKeys: [QueryKeys.allChannels],
  });
};
