import AdbIcon from "@mui/icons-material/Adb";
import AddIcon from "@mui/icons-material/Add";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import {
  useAddUserToChannelMutation,
  useGetAllChannelsQuery,
} from "../api/channelsController";
import {
  useGetAllChannelMessagesQuery,
  useSendChannelMessageMutation,
} from "../api/messageController";
import { useGetAllUsersQuery } from "../api/userController";
import { useGlobal } from "../hooks/GlobalContext";
import {
  EditChannelMemberModal,
  EditChannelMemberModalConfig,
} from "./EditChannelMemberModal";
import { EditChannelModal } from "./EditChannelModal";
import { Message } from "./Messages";

export const ChannelChat = () => {
  const { selectedChat, loggedInUser } = useGlobal();
  const { data: channels } = useGetAllChannelsQuery();
  const { data: users } = useGetAllUsersQuery();
  const channel = channels?.find(
    (x) => x.id.toString() === selectedChat?.identifier
  );

  const loggedInUserChannel = channel?.users.find(
    (x) => x.email === loggedInUser?.email
  );

  const [message, setMessage] = useState("");
  const [editChannelModal, setEditChannelModal] = useState(false);

  const [editChannelConfig, setEditChannelConfig] =
    useState<EditChannelMemberModalConfig>({
      open: false,
      selectedMember: undefined,
    });

  const { data: channelMessages } = useGetAllChannelMessagesQuery(
    channel?.id ?? 0
  );

  const sendMessageMutation = useSendChannelMessageMutation(channel?.id ?? 0);
  const addUserToChannelMutation = useAddUserToChannelMutation();

  if (!channel || !loggedInUserChannel) {
    return null;
  }

  return (
    <>
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
            {channelMessages
              ?.sort((a, b) => {
                return dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? 1 : -1;
              })
              .map((x) => {
                return (
                  <Message
                    key={x.createdAt}
                    username={
                      x.senderUsername !== loggedInUser?.username
                        ? x.senderUsername
                        : "You"
                    }
                    timestamp={dayjs(x.createdAt).format("DD/MM/YYYY HH:mm")}
                    type={
                      x.senderUsername !== loggedInUser?.username
                        ? "receiver"
                        : "sender"
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
            overflow="auto"
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
          overflow="auto"
        >
          <Box overflow="auto" maxHeight="100%">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding={2}
            >
              <Typography color="#000">{channel.name}</Typography>

              {(loggedInUserChannel.role === "ADMIN" ||
                loggedInUserChannel.role === "OWNER") && (
                <IconButton
                  sx={{ marginLeft: 1 }}
                  onClick={() => {
                    setEditChannelModal(true);
                  }}
                >
                  <EditIcon color="primary" />
                </IconButton>
              )}
            </Box>

            <Divider />

            <Typography ml={2} mt={2} color="#000">
              Channel users
            </Typography>
            <List>
              {channel.users.map((x) => {
                return (
                  <ListItem key={x.id} disablePadding>
                    <ListItemButton
                      sx={{
                        paddingLeft:
                          x.username === loggedInUser?.username ? 0 : 8,
                        color: "#000",
                      }}
                    >
                      {x.username === loggedInUser?.username && (
                        <ListItemIcon sx={{ ml: 1 }}>
                          <PersonIcon />
                        </ListItemIcon>
                      )}
                      <ListItemText
                        sx={{ wordBreak: "break-word" }}
                        primary={x.username}
                      />

                      {loggedInUserChannel.role === "OWNER" &&
                        x.username !== loggedInUserChannel.username && (
                          <IconButton
                            sx={{ marginLeft: 1 }}
                            onClick={() => {
                              setEditChannelConfig({
                                open: true,
                                selectedMember: x,
                              });
                            }}
                          >
                            <EditIcon color="primary" />
                          </IconButton>
                        )}

                      {x.role === "ADMIN" && (
                        <ListItemIcon sx={{ ml: 1 }}>
                          <AdminPanelSettingsIcon />
                        </ListItemIcon>
                      )}

                      {x.role === "OWNER" && (
                        <ListItemIcon sx={{ ml: 1 }}>
                          <AdbIcon />
                        </ListItemIcon>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>

            {(loggedInUserChannel.role === "OWNER" ||
              loggedInUserChannel.role === "ADMIN") && (
              <>
                <Divider />

                <Typography ml={2} mt={2} color="#000">
                  Add more users
                </Typography>

                <List>
                  {users
                    ?.filter(
                      (x) =>
                        !channel.users.find((y) => y.username === x.username)
                    )
                    .map((x) => {
                      return (
                        <ListItem key={x.username} disablePadding>
                          <ListItemButton
                            sx={{
                              paddingLeft: 8,
                              color: "#000",
                            }}
                          >
                            <ListItemText primary={x.username} />

                            <ListItemIcon
                              sx={{ ml: 1 }}
                              onClick={() => {
                                addUserToChannelMutation.mutate({
                                  channelId: channel.id,
                                  username: x.username,
                                });
                              }}
                            >
                              <AddIcon />
                            </ListItemIcon>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                </List>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <EditChannelMemberModal
        channel={channel}
        config={editChannelConfig}
        setConfig={setEditChannelConfig}
      />

      <EditChannelModal
        channel={channel}
        loggedInUserChannel={loggedInUserChannel}
        open={editChannelModal}
        setOpen={setEditChannelModal}
      />
    </>
  );
};
