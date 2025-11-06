import { Button, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import arrowBack from "../../assets/arrow-back.svg";
import { useMobileWindowInfo, useSelectedUserId } from "../../utils/contexts";
import { api } from "../../main";
import { ChatUser } from "../../types/user";
import { getProfilePicURL } from "../../utils/requests";
import UserDisplay from "./UserDisplay";

function ConversationTopBar() {
  const { isWindowMobile, setConversationVisible } = useMobileWindowInfo();
  const { selectedUserId } = useSelectedUserId();
  const [selectedUser, setSelectedUser] = useState<ChatUser>();
  const topBarHeightPx = 60;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await api.get(`/api/users/get-by-id/${selectedUserId}`);
        const pfpID = res.data.user.profilePicture;
        const pfpURL = pfpID ? await getProfilePicURL(pfpID) : "";
        setSelectedUser({
          ...res.data.user,
          profilePictureURL: pfpURL,
        });
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [selectedUserId]);

  const handleArrowClick = () => {
    setConversationVisible(false);
  };

  return (
    <Paper elevation={3} sx={{ height: topBarHeightPx, display: "flex" }}>
      {isWindowMobile && (
        <>
          <Button
            sx={{
              minWidth: topBarHeightPx,
              width: topBarHeightPx,
              height: topBarHeightPx,
              display: "flex",
              borderRadius: "50%",
              p: 0, mx: "10px"
            }}
            onClick={handleArrowClick}
          >
            <img
              src={arrowBack}
              alt=""
              width={topBarHeightPx - 10}
              style={{
                margin: "auto 0",
                transform: "rotate(180deg)",
                direction: "ltr",
              }}
            />
          </Button>
        </>
      )}

      {selectedUser && (
        <UserDisplay user={selectedUser} showProfilePic={isWindowMobile} />
      )}
    </Paper>
  );
}

export default ConversationTopBar;
