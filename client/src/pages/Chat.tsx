import { Box } from "@mui/material";
import Sidebar from "../Components/chat/Sidebar";
import { useState } from "react";
import Conversation from "../Components/chat/Conversation";
import ProfileDrawer from "../Components/chat/ProfileDrawer";
import { ChatUser } from "../types/user";
import SearchMenu from "../Components/chat/SearchMenu";

function Chat() {
  const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const [newChatID, setNewChatID] = useState<string | null>(null);

  const handleUserSelect = (user: ChatUser) => setActiveUser(user);

  return (
    <>
      <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
        <ProfileDrawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
          }}
        />
        <Sidebar
          onUserSelected={handleUserSelect}
          onDrawerOpen={() => setDrawerOpen(true)}
          onSearchMenuOpen={() => setSearchMenuOpen(true)}
          newChatID={newChatID}
        />
        <Conversation 
          with={activeUser} 
          onChatCreate={(id) => setNewChatID(id)}
        />
      </Box>
      {searchMenuOpen && (
        <SearchMenu
          onClose={() => setSearchMenuOpen(false)}
          onUserSelect={handleUserSelect}
        />
      )}
    </>
  );
}

export default Chat;
