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
    } else if (loggedInUser) {
      router.push("/chat");
    }
  }, [loggedInUser, router]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cleanup = () => {
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
