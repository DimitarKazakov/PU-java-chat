import { chatAxios } from "../config/axios.config";
import { SESSION_KEY, useGlobal } from "../hooks/GlobalContext";
import { Endpoints } from "./endpoints";
import { AuthUser, LoginRequest, RegisterRequest } from "./types/auth";

export const useLogin = () => {
  const { setLoggedInUser } = useGlobal();

  return async (body: LoginRequest): Promise<AuthUser> => {
    const response = await chatAxios.post(Endpoints.signin, body);

    setLoggedInUser(response.data);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(response.data));
    }
    return response.data as AuthUser;
  };
};

export const useRegister = () => {
  const { setLoggedInUser } = useGlobal();

  return async (body: RegisterRequest): Promise<AuthUser> => {
    const response = await chatAxios.post(Endpoints.register, body);

    setLoggedInUser(response.data);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(response.data));
    }
    return response.data as AuthUser;
  };
};
