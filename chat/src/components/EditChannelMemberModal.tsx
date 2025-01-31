import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  useEditUserChannelRoleMutation,
  useRemoveUserFromChannelMutation,
} from "../api/channelsController";
import {
  ChannelDto,
  ChannelRolesEnum,
  UserChannelDto,
} from "../api/types/channels";

export type EditChannelMemberModalConfig = {
  open: boolean;
  selectedMember: UserChannelDto | undefined;
};
type EditChannelMemberModalProps = {
  channel: ChannelDto;
  config: EditChannelMemberModalConfig;
  setConfig: Dispatch<SetStateAction<EditChannelMemberModalConfig>>;
};

export const EditChannelMemberModal = (props: EditChannelMemberModalProps) => {
  const { channel, config, setConfig } = props;

  const [selectedRole, setSelectedRole] = useState<ChannelRolesEnum>("GUEST");
  useEffect(() => {
    if (config.selectedMember) {
      setSelectedRole(config.selectedMember.role);
    }
  }, [config]);

  const editUserChannelRoleMutation = useEditUserChannelRoleMutation();
  const removeUserFromChannelMutation = useRemoveUserFromChannelMutation();

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={config.open}
      onClose={() =>
        setConfig({
          open: false,
          selectedMember: undefined,
        })
      }
    >
      <DialogTitle>Edit User in Channel</DialogTitle>

      <DialogContent>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
          <RadioGroup
            onChange={(e) => {
              setSelectedRole(e.target.value as ChannelRolesEnum);
            }}
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={selectedRole}
            name="radio-buttons-group"
          >
            <FormControlLabel value="GUEST" control={<Radio />} label="Guest" />
            <FormControlLabel value="ADMIN" control={<Radio />} label="Admin" />
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          type="submit"
          onClick={() => {
            removeUserFromChannelMutation
              .mutateAsync({
                channelId: channel.id,
                username: config.selectedMember?.username || "",
              })
              .then(() => {
                setConfig({ open: false, selectedMember: undefined });
              });
          }}
        >
          Remove from channel
        </Button>

        <Button
          disabled={selectedRole === config.selectedMember?.role}
          variant="contained"
          type="submit"
          onClick={() => {
            editUserChannelRoleMutation
              .mutateAsync({
                channelId: channel.id,
                username: config.selectedMember?.username || "",
                role: selectedRole,
              })
              .then(() => {
                setConfig({ open: false, selectedMember: undefined });
              });
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
