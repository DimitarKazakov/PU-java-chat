import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ChannelChat } from "../components/ChannelChat";
import { FriendsChat } from "../components/FriendsChat";
import { SidepanelContent } from "../components/SidepanelContent";
import { useGlobal } from "../hooks/GlobalContext";

export default function Chat() {
  const { loggedInUser, cleanup, selectedChat } = useGlobal();

  const [openSidepanel, setOpenSidepanel] = useState(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="24px"
      height="100vh"
      sx={{ backgroundColor: "#FFF" }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={() => setOpenSidepanel(true)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {loggedInUser?.username}
            </Typography>

            <Button color="inherit" onClick={() => cleanup()}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Drawer open={openSidepanel} onClose={() => setOpenSidepanel(false)}>
          <SidepanelContent setOpenSidepanel={setOpenSidepanel} />
        </Drawer>
      </Box>

      {!selectedChat && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography
            variant="h3"
            fontWeight={600}
            color="#000"
          >{`Welcome ${loggedInUser?.username}`}</Typography>

          <IconButton
            sx={{ marginLeft: 1 }}
            onClick={() => setOpenSidepanel(true)}
          >
            <ChatIcon color="primary" fontSize="large" />
          </IconButton>
        </Box>
      )}

      {selectedChat && selectedChat.type === "FRIEND" && <FriendsChat />}

      {selectedChat && selectedChat.type === "CHANNEL" && <ChannelChat />}
    </Box>
  );
}
