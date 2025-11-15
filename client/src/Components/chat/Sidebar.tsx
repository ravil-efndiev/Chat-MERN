import { useEffect, useRef, useState } from "react";
import { APIResponseUser, ChatUser } from "../../types/user";
import { Box, Button, colors, Paper } from "@mui/material";
import drawerSwitchImg from "../../assets/drawer-switch.svg";
import searchImg from "../../assets/search.svg";
import { getProfilePicURL } from "../../utils/requests";
import UserDisplay from "./UserDisplay";
import {
  useLastInteractedUserId,
  useMobileWindowInfo,
  useSelectedUserId,
} from "../../utils/contexts";
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

function Sidebar({
  onDrawerOpen,
  onSearchMenuOpen,
  listRefreshTrigger,
}: Props) {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const usersRef = useRef<ChatUser[]>([]);
  const [activeUserID, setActiveUserID] = useState("");
  const { selectedUserId, setSelectedUserId } = useSelectedUserId();
  const { socket } = useSocket();
  const { isWindowMobile, isConversationVisible, setConversationVisible } =
    useMobileWindowInfo();
  const { lastInteractedUserId, setLastInteractedUserId } =
    useLastInteractedUserId();

  const getUsersAndPfps = async () => {
    try {
      const usersRes = await api.get("/api/users/get-chats");
      const resUsers: APIResponseUser[] = usersRes.data.users;
      setUsers(
        resUsers.map((resUser) => ({ ...resUser, profilePictureURL: "" }))
      );
      const usersWithPfps = setUserPfps(resUsers);
      const result = await Promise.all(usersWithPfps);
      setUsers(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      setActiveUserID(selectedUserId);
    }
  }, [selectedUserId]);

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

      if (message.senderID !== lastInteractedUserId) {
        setLastInteractedUserId(message.senderID);
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
    setSelectedUserId(user.id);
    setActiveUserID(user.id);
    if (isWindowMobile) {
      setConversationVisible(true);
    }
  };

  const renderUserDisplay = (user: ChatUser) => {
    if (!user) return;
    return (
      <Box
        sx={{
          display: "flex",
          padding: "15px",
          cursor: "pointer",
          transition: "background-color 250ms",
          ...(activeUserID === user.id && {
            bgcolor: colors.deepPurple[400] + "aa",
          }),
          "&:hover": {
            bgcolor: colors.deepPurple[600] + "36",
            ...(activeUserID === user.id && {
              bgcolor: colors.deepPurple[400] + "aa",
            }),
          },
        }}
        key={user.id}
        onClick={() => handleUserClick(user)}
      >
        <UserDisplay user={user} />
      </Box>
    );
  };

  return (
    <Paper
      elevation={5}
      className="sidebar"
      sx={{
        width: { lg: "25vw", md: "30vw", sm: "40vw", xs: "100vw" },
        overflowY: "auto",
        display: isWindowMobile && isConversationVisible ? "none" : "flex",
        flexDirection: "column",
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
          sx={{ p: 0, my: "auto", minWidth: 52, width: 52, height: 52 }}
        >
          <img src={drawerSwitchImg} width={30} alt="drawer switch" />
        </Button>
        <Button
          onClick={() => onSearchMenuOpen()}
          sx={{ borderRadius: "50%", px: 2, py: 2 }}
        >
          <img src={searchImg} width={30} alt="searchbar switch" />
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
        }}
      >
        {lastInteractedUserId !== "" &&
          renderUserDisplay(
            users.find((user) => user.id === lastInteractedUserId)!
          )}
        {users.map(
          (user) => user.id !== lastInteractedUserId && renderUserDisplay(user)
        )}
      </Box>
    </Paper>
  );
}

export default Sidebar;
