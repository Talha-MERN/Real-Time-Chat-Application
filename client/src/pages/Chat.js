import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import PrimarySearchAppBar from "../layouts/MUI_Header";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { Box } from "@mui/material";

const Chat = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/");
    }
  }); // [isAuthenticated, navigate]

  return (
    <>
      <PrimarySearchAppBar />

      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        padding="10px"
      >
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </>
  );
};

export default Chat;
