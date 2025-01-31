import { Box, Typography } from "@mui/material";

type MessageProps = {
  username: string;
  timestamp: string;
  message: string;
  type: "sender" | "receiver";
};

export const Message = (props: MessageProps) => {
  const { username, timestamp, message, type } = props;

  return (
    <Box width="50%" alignSelf={type === "sender" ? "end" : "start"}>
      <Box display="flex" justifyContent="space-between">
        <Typography color="#000">{username}</Typography>

        <Typography color="#000">{timestamp}</Typography>
      </Box>
      <Box
        display="flex"
        width="100%"
        sx={{
          backgroundColor: type === "sender" ? "#2196f3" : "#a2aba3",
          padding: "12px",
          borderRadius: "8px",
        }}
      >
        <Typography
          sx={{ wordBreak: "break-word" }}
          color={type === "sender" ? "#fff" : "#000"}
          fontWeight={500}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};
