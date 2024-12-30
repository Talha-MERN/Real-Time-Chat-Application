import React from "react";
import { useChatStore } from "../stores/chatStore";
import Box from "@mui/material/Box";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatStore();
  return (
    <Box
      display={{ xs: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      p={3}
      bgcolor="white"
      width={{ xs: "100%", md: "68%" }}
      borderRadius="lg" // Border radius
      border={1} // Border width
      borderColor="grey.500" // Set border color if needed
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
