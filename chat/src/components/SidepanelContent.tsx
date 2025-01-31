import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import ThreePIcon from "@mui/icons-material/ThreeP";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useGetAllChannelsQuery } from "../api/channelsController";
import {
  useAddFriendMutation,
  useGetAllFriendsQuery,
} from "../api/friendsController";
import { useGetAllUsersQuery } from "../api/userController";
import { useGlobal } from "../hooks/GlobalContext";
import { CreateChannelModal } from "./CreateChannelModal";

type SidepanelContentProps = {
  setOpenSidepanel: Dispatch<SetStateAction<boolean>>;
};

export const SidepanelContent = (props: SidepanelContentProps) => {
  const { setOpenSidepanel } = props;

  const { loggedInUser, setSelectedChat } = useGlobal();
  const { data: users } = useGetAllUsersQuery();
  const { data: friends } = useGetAllFriendsQuery();
  const { data: channels } = useGetAllChannelsQuery();
  const addFriendMutation = useAddFriendMutation();

  const [openCreateChannel, setOpenCreateChannel] = useState(false);

  const availableUsers = users?.filter((x) => {
    return (
      !friends?.find((y) => y.email === x.email) &&
      loggedInUser?.email !== x.email
    );
  });

  return (
    <Box sx={{ width: 500 }} role="presentation">
      <Box
        display="flex"
        marginTop={1}
        paddingX={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h5">Channels</Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateChannel(true)}
        >
          Create
        </Button>
      </Box>

      <List>
        {channels?.map((x) => (
          <ListItem key={x.id} disablePadding>
            <ListItemButton
              onClick={() => {
                setOpenSidepanel(false);
                setSelectedChat({
                  identifier: x.id.toString(),
                  type: "CHANNEL",
                });
              }}
            >
              <ListItemIcon>
                <SpeakerNotesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={x.name} />
            </ListItemButton>
          </ListItem>
        ))}

        {channels?.length === 0 && (
          <Typography paddingX={1} marginTop={1}>
            No channels found
          </Typography>
        )}
      </List>

      <Divider />

      <Typography paddingX={2} marginTop={1} variant="h5">
        Friends
      </Typography>

      <List>
        {friends
          ?.map((x) => x.username)
          .map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => {
                  setOpenSidepanel(false);
                  setSelectedChat({
                    identifier: text,
                    type: "FRIEND",
                  });
                }}
              >
                <ListItemIcon>
                  <ThreePIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}

        {friends?.length === 0 && (
          <Typography paddingX={1} marginTop={1}>
            No friend found
          </Typography>
        )}
      </List>

      <Divider />

      <Typography paddingX={2} marginTop={1} variant="h5">
        Users
      </Typography>

      <List>
        {availableUsers
          ?.map((x) => x.username)
          .map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => addFriendMutation.mutate(text)}>
                <ListItemText primary={text} />
                <ListItemIcon>
                  <PersonAddIcon color="primary" />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}

        {availableUsers?.length === 0 && (
          <Typography paddingX={1} marginTop={1}>
            No users found
          </Typography>
        )}
      </List>

      <CreateChannelModal
        openCreateChannel={openCreateChannel}
        setOpenCreateChannel={setOpenCreateChannel}
      />
    </Box>
  );
};
