import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  useDeleteChannelMutation,
  useEditChannelNameMutation,
} from "../api/channelsController";
import { ChannelDto, UserChannelDto } from "../api/types/channels";
import { useGlobal } from "../hooks/GlobalContext";

type EditChannelModalProps = {
  channel: ChannelDto;
  loggedInUserChannel: UserChannelDto;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditChannelModal = (props: EditChannelModalProps) => {
  const { channel, loggedInUserChannel, open, setOpen } = props;

  const { setSelectedChat } = useGlobal();
  const [name, setName] = useState(channel.name);
  useEffect(() => {
    if (open) {
      setName(channel.name);
    }
  }, [open, channel.name]);

  const editChannelNameMutation = useEditChannelNameMutation();
  const deleteChannelMutation = useDeleteChannelMutation();

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          editChannelNameMutation
            .mutateAsync({ channelId: channel.id, name: name })
            .then(() => {
              setOpen(false);
              setName("");
            });
        },
      }}
    >
      <DialogTitle>Edit Channel</DialogTitle>

      <DialogContent>
        <TextField
          onChange={(e) => setName(e.target.value)}
          value={name}
          fullWidth
          autoFocus
          required
          margin="dense"
          id="name"
          name="name"
          label="Channel Name"
          type="text"
          variant="standard"
        />
      </DialogContent>

      <DialogActions>
        {loggedInUserChannel.role === "OWNER" && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              deleteChannelMutation.mutate(channel.id);
              setOpen(false);
              setName("");
              setSelectedChat(undefined);
            }}
          >
            Delete
          </Button>
        )}

        <Button
          disabled={name.length < 6 || name === channel.name}
          variant="contained"
          type="submit"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
