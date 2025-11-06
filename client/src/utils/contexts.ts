import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface SelectedUserContextType {
  selectedUserId: string;
  setSelectedUserId: Dispatch<SetStateAction<string>>;
}

interface LastInteractedUserContextType {
  lastInteractedUserId: string;
  setLastInteractedUserId: Dispatch<SetStateAction<string>>;
}

interface MobileWindowInfoContextType {
  isWindowMobile: boolean;
  isConversationVisible: boolean;
  setConversationVisible: Dispatch<SetStateAction<boolean>>;
}

export const SelectedUserIdContext = createContext<
  SelectedUserContextType | undefined
>(undefined);

export const MobileWindowInfoContext = createContext<
  MobileWindowInfoContextType | undefined
>(undefined);

export const LastInteractedUserIdContext = createContext<
  LastInteractedUserContextType | undefined
>(undefined);

export function useMobileWindowInfo() {
  const context = useContext(MobileWindowInfoContext);

  if (!context) {
    throw new Error("Context should be only used inside it's provider");
  }

  return context;
}

export function useSelectedUserId() {
  const context = useContext(SelectedUserIdContext);

  if (!context) {
    throw new Error("Context should be only used inside it's provider");
  }

  return context;
}

export function useLastInteractedUserId() {
  const context = useContext(LastInteractedUserIdContext);

  if (!context) {
    throw new Error("Context should be only used inside it's provider");
  }

  return context;
}
