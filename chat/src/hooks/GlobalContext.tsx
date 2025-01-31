import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  Dispatch,
  type ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthUser } from "../api/types/auth";

type GlobalProviderProps = {
  children: ReactNode;
};

export type Chat = {
  type: "CHANNEL" | "FRIEND";
  identifier: string;
};

type GlobalContextType = {
  loggedInUser: AuthUser | undefined;
  setLoggedInUser: Dispatch<SetStateAction<AuthUser | undefined>>;

  selectedChat: Chat | undefined;
  setSelectedChat: Dispatch<SetStateAction<Chat | undefined>>;

  cleanup: () => void;
};

const initialValue: GlobalContextType = {
  loggedInUser: undefined,
  setLoggedInUser: () => null,

  selectedChat: undefined,
  setSelectedChat: () => null,

  cleanup: () => {},
};

export const SESSION_KEY = "AUTH";

const GlobalContext = createContext(initialValue);

export const GlobalProvider = (props: GlobalProviderProps) => {
  const { children } = props;

  const queryClient = useQueryClient();
  const [loggedInUser, setLoggedInUser] = useState<AuthUser>();
  const [selectedChat, setSelectedChat] = useState<Chat>();

  const router = useRouter();
  useEffect(() => {
    if (!loggedInUser && router.pathname === "/chat") {
      router.push("/login");
    } else if (
      loggedInUser &&
      (router.pathname === "/login" || router.pathname === "/register")
    ) {
      router.push("/chat");
    }
  }, [loggedInUser, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem(SESSION_KEY);
      if (auth) {
        setLoggedInUser(JSON.parse(auth));
      }
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cleanup = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setLoggedInUser(undefined);
    setSelectedChat(undefined);
    queryClient.removeQueries();
  };

  const value = useMemo(
    () => ({
      loggedInUser,
      setLoggedInUser,
      selectedChat,
      setSelectedChat,
      cleanup,
    }),
    [loggedInUser, setLoggedInUser, selectedChat, setSelectedChat, cleanup]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export function useGlobal(): GlobalContextType {
  return useContext(GlobalContext);
}
