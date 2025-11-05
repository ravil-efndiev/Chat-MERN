import { useEffect, useRef, useState } from "react";
import { APIResponseUser, ChatUser } from "../../types/user";
import { Box, Button, Paper } from "@mui/material";
import drawerSwitchImg from "../../assets/drawer-switch.svg";
import searchImg from "../../assets/search.svg";
import { getProfilePicURL } from "../../utils/requests";
import UserDisplay from "./UserDisplay";
import { useMobileWindowInfo, useSelectedUserID } from "../../pages/Chat";
import { useSocket } from "../SocketProvider";
import { APIResponseMessage } from "../../types/message";
import { api } from "../../main";

export function setUserPfps(users: APIResponseUser[]) {
  return users.map(
    async (user): Promise<ChatUser> => ({
      ...user,
      profilePictureURL: user.profilePicture
        ? await getProfilePicURL(user.profilePicture)
        : "",
    })
  );
}

interface Props {
  onDrawerOpen: () => void;
  onSearchMenuOpen: () => void;
  listRefreshTrigger: number;
}

function  Sidebar({
  onDrawerOpen,
  onSearchMenuOpen,
  listRefreshTrigger,
}: Props) {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const usersRef = useRef<ChatUser[]>([]);
  const [activeUserID, setActiveUserID] = useState("");
  const { selectedUserID, setSelectedUserID } = useSelectedUserID();
  const { socket } = useSocket();
  const { isWindowMobile, isConversationVisible, setConversationVisible } = useMobileWindowInfo();

  const getUsersAndPfps = async () => {
    try {
      const usersRes = await api.get("/api/users/get-chats");
      const resUsers: APIResponseUser[] = usersRes.data.users;
      const usersWithPfps = setUserPfps(resUsers);
      setUsers(await Promise.all(usersWithPfps));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedUserID) {
      setActiveUserID(selectedUserID);
    }
  }, [selectedUserID]);

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageRecieve = (message: {
      senderID: string;
      message: APIResponseMessage;
    }) => {
      const chatExists = usersRef.current.some(
        (user) => user.id === message.senderID
      );
      if (!chatExists) {
        getUsersAndPfps();
      }
    };

    socket.on("message", handleMessageRecieve);

    return () => {
      socket.off("message", handleMessageRecieve);
    };
  }, [socket]);

  useEffect(() => {
    getUsersAndPfps();
  }, [listRefreshTrigger]);

  const handleUserClick = (user: ChatUser) => {
    setSelectedUserID(user.id);
    setActiveUserID(user.id);
    if (isWindowMobile) {
      setConversationVisible(true);
    }
  };

  return (
    <Paper
      elevation={5}
      className="sidebar"
      sx={{
        width: { lg: "25vw", md: "30vw", sm: "40vw", xs: "100vw" },
        height: "100vh",
        overflowY: "auto",
        display: isWindowMobile && isConversationVisible ? "none" : "block",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 2,
          py: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={() => onDrawerOpen()}
          sx={{ minWidth: 0, p: 1 }}
        >
          <img src={drawerSwitchImg} width={30} alt="drawer switch" />
        </Button>
        <img
          onClick={() => onSearchMenuOpen()}
          src={searchImg}
          width={30}
          alt="searchbar switch"
          style={{ cursor: "pointer" }}
        />
      </Box>
      {users.map((user) => (
        <div
          className={
            activeUserID === user.id
              ? "sidebar-user user-active"
              : "sidebar-user"
          }
          key={user.id}
          onClick={() => handleUserClick(user)}
        >
          <UserDisplay user={user} />
        </div>
      ))}
    </Paper>
  );
}

export default Sidebar;
