import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useGetAllFriendsQuery } from "../api/friendsController";
import {
  useGetAllFriendsMessagesQuery,
  useSendFriendMessageMutation,
} from "../api/messageController";
import { useGlobal } from "../hooks/GlobalContext";
import { Message } from "./Messages";

export const FriendsChat = () => {
  const { selectedChat, loggedInUser } = useGlobal();
  const { data: friends } = useGetAllFriendsQuery();
  const friend = friends?.find((x) => x.username === selectedChat?.identifier);

  const [message, setMessage] = useState("");

  const { data: friendMessages } = useGetAllFriendsMessagesQuery(
    friend?.username ?? ""
  );
  const sendMessageMutation = useSendFriendMessageMutation(
    friend?.username ?? ""
  );

  if (!friend) {
    return null;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-around"
      gap="24px"
      height="85%"
      width="100%"
    >
      <Box
        height="90%"
        width="70%"
        border="2px solid #2196f3"
        borderRadius="4px"
        display="flex"
        flexDirection="column"
        gap="24px"
      >
        <Box
          display="flex"
          flexDirection="column"
          padding="16px"
          height="80%"
          width="100%"
          gap="12px"
          overflow="auto"
        >
          {friendMessages
            ?.sort((a, b) => {
              return dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? 1 : -1;
            })
            .map((x) => {
              return (
                <Message
                  key={x.createdAt}
                  username={
                    x.senderUsername === friend.username
                      ? friend.username
                      : "You"
                  }
                  timestamp={dayjs(x.createdAt).format("DD/MM/YYYY HH:mm")}
                  type={
                    x.senderUsername === friend.username ? "receiver" : "sender"
                  }
                  message={x.message}
                />
              );
            })}
        </Box>

        <Box
          height="20%"
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
        >
          <TextField
            id="message"
            label="Message"
            placeholder="Write you your friends..."
            multiline
            rows={4}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            fullWidth
            autoFocus
            required
            name="message"
            type="text"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment onClick={() => {}} position="end">
                    <IconButton
                      disabled={message.length === 0}
                      sx={{ marginLeft: 1 }}
                      onClick={() => {
                        sendMessageMutation.mutate(message);
                        setMessage("");
                      }}
                    >
                      <SendIcon color="primary" fontSize="large" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>

      <Box
        height="90%"
        width="27%"
        border="2px solid #2196f3"
        borderRadius="4px"
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ color: "#000" }}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={loggedInUser?.username} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ paddingLeft: 9, color: "#000" }}>
              <ListItemText primary={friend.username} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
