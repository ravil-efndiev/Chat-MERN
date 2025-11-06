import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "../Components/chat/Sidebar";
import { useState } from "react";
import Conversation from "../Components/chat/Conversation";
import ProfileDrawer from "../Components/chat/ProfileDrawer";
import SearchMenu from "../Components/chat/SearchMenu";
import {
  LastInteractedUserIdContext,
  MobileWindowInfoContext,
  SelectedUserIdContext,
} from "../utils/contexts";

function Chat() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [lastInteractedUserId, setLastInteractedUserId] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isWindowMobile = useMediaQuery("(max-width: 600px)");
  const [isConversationVisible, setIsConversationVisible] = useState(false);

  const refreshChatList = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <SelectedUserIdContext.Provider
      value={{
        selectedUserId: selectedUserId,
        setSelectedUserId: setSelectedUserId,
      }}
    >
      <LastInteractedUserIdContext.Provider
        value={{
          lastInteractedUserId: lastInteractedUserId,
          setLastInteractedUserId: setLastInteractedUserId,
        }}
      >
        <MobileWindowInfoContext.Provider
          value={{
            isWindowMobile: isWindowMobile,
            isConversationVisible: isConversationVisible,
            setConversationVisible: setIsConversationVisible,
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100vh",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <ProfileDrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            />
            <Sidebar
              onDrawerOpen={() => setDrawerOpen(true)}
              onSearchMenuOpen={() => setSearchMenuOpen(true)}
              listRefreshTrigger={refreshTrigger}
            />
            <Conversation refreshChatList={refreshChatList} />
          </Box>
          {searchMenuOpen && (
            <SearchMenu onClose={() => setSearchMenuOpen(false)} />
          )}
        </MobileWindowInfoContext.Provider>
      </LastInteractedUserIdContext.Provider>
    </SelectedUserIdContext.Provider>
  );
}

export default Chat;
