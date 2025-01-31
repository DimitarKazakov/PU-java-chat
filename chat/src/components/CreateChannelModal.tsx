import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useCreateChannelMutation } from "../api/channelsController";

type CreateChannelModalProps = {
  openCreateChannel: boolean;
  setOpenCreateChannel: Dispatch<SetStateAction<boolean>>;
};

export const CreateChannelModal = (props: CreateChannelModalProps) => {
  const { openCreateChannel, setOpenCreateChannel } = props;

  const [channel, setChannel] = useState("");

  const createChannelMutation = useCreateChannelMutation();

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={openCreateChannel}
      onClose={() => setOpenCreateChannel(false)}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formJson = Object.fromEntries((formData as any).entries());
          const channel = formJson.channel;

          createChannelMutation.mutateAsync(channel).then(() => {
            setOpenCreateChannel(false);
            setChannel("");
          });
        },
      }}
    >
      <DialogTitle>Create Channel</DialogTitle>

      <DialogContent>
        <TextField
          onChange={(e) => setChannel(e.target.value)}
          value={channel}
          fullWidth
          autoFocus
          required
          margin="dense"
          id="channel"
          name="channel"
          label="Channel Name"
          type="text"
          variant="standard"
        />
      </DialogContent>

      <DialogActions>
        <Button disabled={channel.length < 6} variant="contained" type="submit">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
