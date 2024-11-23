import { Box } from "@mui/material";
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

const SelectedUserIDContext = createContext<SelectedUserContextType | undefined>(undefined);

function Chat() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState("");

  return (
    <SelectedUserIDContext.Provider
      value={{ selectedUserID, setSelectedUserID }}
    >
      <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
        <ProfileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
        <Sidebar
          onDrawerOpen={() => setDrawerOpen(true)}
          onSearchMenuOpen={() => setSearchMenuOpen(true)}
        />
        <Conversation with={selectedUserID} />
      </Box>
      {searchMenuOpen && (
        <SearchMenu onClose={() => setSearchMenuOpen(false)} />
      )}
    </SelectedUserIDContext.Provider>
  );
}

export function useSelectedUserID() {
  const context = useContext(SelectedUserIDContext);

  if (!context) {
    throw new Error("Context should be only used inside it's provider");
  }

  return context;
}

export default Chat;
