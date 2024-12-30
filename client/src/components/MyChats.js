import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "../stores/chatStore";
import { chatEndpoints } from "../api/endpoints/chatEndpoints";
import ChatLoading from "../layouts/chatLoading";
import axios from "axios";
import toast from "react-hot-toast";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { getSender } from "../api/configs";
import GroupChatModel from "../layouts/GroupChatModel";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chats, setChats } = useChatStore();
  const { isAuthenticated } = useAuthStore();

  const fetchChats = async () => {
    try {
      const response = await axios.get(chatEndpoints.fetchingChats(), {
        headers: {
          "Content-Type": "application/json, multipart/form-data",
        },
        withCredentials: true,
      });
      setChats(response.data);
    } catch (error) {
      toast.error("Error fetching the chat");
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setLoggedUser(JSON.parse(userInfo));
    }

    if (isAuthenticated) {
      fetchChats();
    }
  }, [isAuthenticated, fetchAgain]);

  return (
    <Box
      display={{ xs: selectedChat ? "none" : "flex", md: "flex" }} // Responsive display prop
      flexDirection="column" // Flex direction
      alignItems="center" // Align items to center
      padding={3} // Padding
      bgcolor="white" // Background color
      width={{ xs: "100%", md: "31%" }} // Responsive width
      borderRadius="lg" // Border radius
      border={1} // Border width
      borderColor="grey.500" // Set border color if needed
    >
      <Box
        pb={3}
        px={3}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          fontSize: { xs: "28px", md: "30px" },
          fontFamily: "Work Sans, sans-serif",
        }}
        className="font-sans"
      >
        My Chats
        <GroupChatModel>
          <Button
            sx={{
              display: "flex",
              fontSize: { xs: "17px", md: "10px", lg: "17px" },
              backgroundColor: "#E0E0E0", // light grey color
              color: "black",
              "&:hover": {
                backgroundColor: "#d1d1d1", // slightly darker on hover
              },
            }}
            endIcon={<AddIcon />}
            className="flex items-center justify-center"
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 3,
          backgroundColor: "#F8F8F8",
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          overflowY: "hidden",
        }}
        className="p-3 bg-gray-100 w-full h-full rounded-lg overflow-y-hidden"
      >
        {chats ? (
          <Stack spacing={1} sx={{ overflowY: "scroll" }}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer px-3 py-2 rounded-lg transition-colors duration-200 ${
                  selectedChat === chat
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                key={chat._id}
              >
                <Typography>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
