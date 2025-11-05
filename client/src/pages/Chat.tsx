import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "../Components/chat/Sidebar";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Conversation from "../Components/chat/Conversation";
import ProfileDrawer from "../Components/chat/ProfileDrawer";
import SearchMenu from "../Components/chat/SearchMenu";

interface SelectedUserContextType {
  selectedUserID: string;
  setSelectedUserID: Dispatch<SetStateAction<string>>;
}

const SelectedUserIDContext = createContext<
  SelectedUserContextType | undefined
>(undefined);

interface MobileWindowInfo {
  isWindowMobile: boolean;
  isConversationVisible: boolean;
  setConversationVisible: Dispatch<SetStateAction<boolean>>;
}

const MobileWindowInfoContext = createContext<MobileWindowInfo | undefined>(
  undefined
);

function Chat() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isWindowMobile = useMediaQuery("(max-width: 600px)");
  const [isConversationVisible, setIsConversationVisible] = useState(false);

  const refreshChatList = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <SelectedUserIDContext.Provider
      value={{ selectedUserID, setSelectedUserID }}
    >
      <MobileWindowInfoContext.Provider
        value={{
          isWindowMobile: isWindowMobile,
          isConversationVisible: isConversationVisible,
          setConversationVisible: setIsConversationVisible,
        }}
      >
        <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
          <ProfileDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
          <Sidebar
            onDrawerOpen={() => setDrawerOpen(true)}
            onSearchMenuOpen={() => setSearchMenuOpen(true)}
            listRefreshTrigger={refreshTrigger}
          />
          <Conversation
            refreshChatList={refreshChatList}
          />
        </Box>
        {searchMenuOpen && (
          <SearchMenu onClose={() => setSearchMenuOpen(false)} />
        )}
      </MobileWindowInfoContext.Provider>
    </SelectedUserIDContext.Provider>
  );
}

export function useMobileWindowInfo() {
  const context = useContext(MobileWindowInfoContext);

  if (!context) {
    throw new Error("Context should be only used inside it's provider");
  }

  return context;
}

export function useSelectedUserID() {
  const context = useContext(SelectedUserIDContext);

  if (!context) {
    throw new Error("Context should be only used inside it's provider");
  }

  return context;
}

export default Chat;
