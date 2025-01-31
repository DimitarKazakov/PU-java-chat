import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { chatAxios } from "../config/axios.config";
import { useGlobal } from "../hooks/GlobalContext";
import { Endpoints, QueryKeys } from "./endpoints";
import { LoginRequest } from "./types/auth";
import { UserDto } from "./types/users";

const getAllUsers = async (request: LoginRequest): Promise<UserDto[]> => {
  const params = qs.stringify(request);
  const response = await chatAxios.get(`${Endpoints.users}?${params}`);

  return response.data as UserDto[];
};

export const useGetAllUsersQuery = () => {
  const { loggedInUser } = useGlobal();

  return useQuery({
    queryKey: QueryKeys.allUsers,
    queryFn: () =>
      getAllUsers({
        email: loggedInUser?.email ?? "",
        password: loggedInUser?.password ?? "",
      }),
  });
};
