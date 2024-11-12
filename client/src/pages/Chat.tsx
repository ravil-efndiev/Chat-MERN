import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import { useState } from "react";
import Conversation from "../Components/Conversation";

function Chat() {
  const [activeUserID, setActiveUserID] = useState("");

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar onUserSelected={(id) => setActiveUserID(id)} />
      <Conversation with={activeUserID} />
    </Box>
  );
}

export default Chat;
