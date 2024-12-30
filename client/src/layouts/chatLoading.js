import { Skeleton, Stack } from "@mui/material";
import React from "react";

const ChatLoading = () => {
  return (
    <div>
      <Stack spacing={1}>
        {[...Array(12)].map((_, index) => (
          <Skeleton key={index} height="45px" />
        ))}
      </Stack>
    </div>
  );
};

export default ChatLoading;
