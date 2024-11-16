import { Box } from "@mui/material";
import Sidebar from "../Components/chat/Sidebar";
import { useState } from "react";
import Conversation from "../Components/chat/Conversation";
import ProfileDrawer from "../Components/chat/ProfileDrawer";
import { ChatUser } from "../types/user";

function Chat() {
  const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          onUserSelected={(user) => setActiveUser(user)}
          onDrawerOpen={() => {
            setDrawerOpen(true);
          }}
        />
        <Conversation with={activeUser} />
      </Box>
    </>
  );
}

export default Chat;
