import { Box } from "@mui/material";
import Sidebar from "../Components/chat/Sidebar";
import { useEffect, useState } from "react";
import Conversation from "../Components/chat/Conversation";
import { useAuth } from "../Components/authentication/AuthProvider";
import axios from "axios";
import ProfileDrawer from "../Components/chat/ProfileDrawer";

function Chat() {
  const [activeUserID, setActiveUserID] = useState("");
  const { currentUser } = useAuth();
  const [pfpUrl, setPfpUrl] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {

  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <ProfileDrawer 
          open={drawerOpen}
          onClose={() => {setDrawerOpen(false)}}
        />
        <Sidebar 
          onUserSelected={(id) => setActiveUserID(id)} 
          onDrawerOpen={() => {setDrawerOpen(true)}}
        />
        <Conversation with={activeUserID} />
      </Box>
      <img src={pfpUrl} alt="" />
    </>
  );
}

export default Chat;
