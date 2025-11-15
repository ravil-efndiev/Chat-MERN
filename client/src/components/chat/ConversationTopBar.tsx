import { Button, Paper } from "@mui/material";
import arrowBack from "../../assets/arrow-back.svg";
import { useMobileWindowInfo, useSelectedUserId } from "../../utils/contexts";
import { getUserData } from "../../utils/requests";
import UserDisplay from "./UserDisplay";
import { useQuery } from "@tanstack/react-query";

function ConversationTopBar() {
  const { isWindowMobile, setConversationVisible } = useMobileWindowInfo();
  const { selectedUserId } = useSelectedUserId();
  const topBarHeightPx = 60;

  const { data: selectedUser } = useQuery({
    queryKey: ["topBarUser", selectedUserId],
    queryFn: () => getUserData(selectedUserId),
    staleTime: 5 * 60 * 1000,
    enabled: !!selectedUserId,
  });

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
              p: 0,
              mx: "10px",
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
