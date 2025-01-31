import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { chatAxios } from "../config/axios.config";
import { useGlobal } from "../hooks/GlobalContext";
import { useMutationRequest } from "../hooks/useQueryRequest";
import { Endpoints, QueryKeys } from "./endpoints";
import { LoginRequest } from "./types/auth";
import { AddFriendRequest } from "./types/friend";
import { UserDto } from "./types/users";

const getAllFriends = async (request: LoginRequest): Promise<UserDto[]> => {
  const params = qs.stringify(request);
  const response = await chatAxios.get(`${Endpoints.friends}?${params}`);

  return response.data as UserDto[];
};

export const useGetAllFriendsQuery = () => {
  const { loggedInUser } = useGlobal();

  return useQuery({
    queryKey: QueryKeys.allFriends,
    queryFn: () =>
      getAllFriends({
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      }),
  });
};

const addFriend = async (request: AddFriendRequest): Promise<void> => {
  await chatAxios.post(Endpoints.friends, request);
};

export const useAddFriendMutation = () => {
  const { loggedInUser } = useGlobal();

  return useMutationRequest({
    func: (username: string) => {
      return addFriend({
        friendUsername: username,
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      });
    },
    invalidateKeys: [QueryKeys.allFriends],
  });
};
