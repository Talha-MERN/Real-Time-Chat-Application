import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../stores/chatStore";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSender, getSenderFull } from "../api/configs";
import ProfileModal from "../layouts/ProfileModal";
import UpdateGroupChatModal from "../layouts/UpdateGroupChatModal";
import { messageEndpoints } from "../api/endpoints/messageEndpoints";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import { debounce } from "lodash";

const ENDPOINT = "http://localhost:5000";
let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat } = useChatStore();
  const userData = JSON.parse(localStorage.getItem("userInfo"));

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const messagesEndRef = useRef();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axios.get(
        messageEndpoints.fetchMessages(selectedChat._id),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load the messages.");
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Cannot send an empty message.");
      return;
    }

    try {
      setNewMessage("");
      const { data } = await axios.post(
        messageEndpoints.sendMessage(),
        { content: newMessage, chatId: selectedChat._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      socket.emit("new message", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      toast.error("Failed to send the message.");
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("message received", (newMessageRecieved) => {
      if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
        // Notification logic here
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    });

    return () => socket.disconnect();
  }, [selectedChat]);

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Add typing logic here
  };

  return (
    <>
      {selectedChat ? (
        <>
          {/* Header */}
          <Typography
            fontSize={{ xs: "28px", md: "30px" }}
            paddingBottom={3}
            paddingX={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              onClick={() => setSelectedChat("")}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <ArrowBackIcon />
            </IconButton>

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(userData, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(userData, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Typography>

          {/* Messages */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            padding={3}
            bgcolor="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <CircularProgress
                size={50}
                sx={{ alignSelf: "center", margin: "auto" }}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
                <div ref={messagesEndRef}></div>
              </div>
            )}

            {/* Input Box */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  placeholder="Type Messages Here ..."
                  variant="outlined"
                  onChange={typingHandler}
                  value={newMessage}
                  fullWidth
                />
              </FormControl>
              <Button variant="contained" color="primary" onClick={sendMessage}>
                Send
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography variant="h4" paddingBottom={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from "react";
// import { useChatStore } from "../stores/chatStore";
// import {
//   Box,
//   Button,
//   FormControl,
//   IconButton,
//   TextField,
//   Typography,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { getSender, getSenderFull } from "../api/configs";
// import ProfileModal from "../layouts/ProfileModal";
// import UpdateGroupChatModal from "../layouts/UpdateGroupChatModal";
// import { CircularProgress } from "@mui/material";
// import { messageEndpoints } from "../api/endpoints/messageEndpoints";
// import axios from "axios";
// import toast from "react-hot-toast";
// import "./styles.css";
// import ScrollableChat from "./ScrollableChat";
// import { io } from "socket.io-client";

// const ENDPOINT = "http://localhost:5000";
// var socket, selectedChatCompare;

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//   const { selectedChat, setSelectedChat } = useChatStore();
//   const user = localStorage.getItem("userInfo");
//   const userData = JSON.parse(localStorage.getItem("userInfo"));

//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newMessage, setNewMessage] = useState();
//   const [socketConnected, setSocketConnected] = useState(false);

//   const fetchMessages = async () => {
//     if (!selectedChat) return;
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         messageEndpoints.fetchMessages(selectedChat._id),
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );
//       console.log(messages);
//       setMessages(data);
//       setLoading(false);
//       socket.emit("join chat", selectedChat._id);
//     } catch (error) {
//       toast.error("Failed to load the messages.");
//       setLoading(false);
//     }
//   };

//   const sendMessage = async () => {
//     if (newMessage) {
//       try {
//         setNewMessage("");
//         const { data } = await axios.post(
//           messageEndpoints.sendMessage(),
//           {
//             content: newMessage,
//             chatId: selectedChat._id,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//             withCredentials: true,
//           }
//         );
//         socket.emit("new message", data);
//         setMessages([...messages, data]);
//       } catch (error) {
//         toast.error("Failed to send the message.");
//       }
//     }
//   };

//   useEffect(() => {
//     socket = io(ENDPOINT);
//     socket.emit("setup", userData);
//     console.log(userData);
//     // console.log(userData._id);
//     socket.on("connection", () => setSocketConnected(true));
//   }, []);

//   useEffect(() => {
//     fetchMessages();
//     selectedChatCompare = selectedChat;
//   }, [selectedChat]);

//   useEffect(() => {
//     socket.on("message received", (newMessageRecieved) => {
//       if (
//         !selectedChatCompare ||
//         selectedChatCompare._id !== newMessageRecieved.chat._id
//       ) {
//         // give notification
//       } else {
//         setMessages([...messages, newMessageRecieved]);
//       }
//     });
//   });

//   const typingHandler = (e) => {
//     setNewMessage(e.target.value);

//     // Typing Indicator Logic here
//   };

//   return (
//     <>
//       {selectedChat ? (
//         <>
//           <Typography
//             fontSize={{ xs: "28px", md: "30px" }}
//             paddingBottom={3}
//             paddingX={2}
//             width="100%"
//             fontFamily="Work sans"
//             display="flex"
//             justifyContent={{ xs: "space-between", md: "space-between" }}
//             alignItems="center"
//           >
//             <IconButton
//               onClick={() => setSelectedChat("")}
//               sx={{
//                 display: { xs: "flex", md: "none" },
//               }}
//             >
//               <ArrowBackIcon />
//             </IconButton>

//             {!selectedChat.isGroupChat ? (
//               <>
//                 {getSender(user, selectedChat.users)}
//                 <ProfileModal user={getSenderFull(user, selectedChat.users)} />
//               </>
//             ) : (
//               <>
//                 {selectedChat.chatName}
//                 {
//                   <UpdateGroupChatModal
//                     fetchAgain={fetchAgain}
//                     setFetchAgain={setFetchAgain}
//                     fetchMessages={fetchMessages}
//                   />
//                 }
//               </>
//             )}
//           </Typography>
//           <Box
//             display="flex"
//             flexDirection="column"
//             justifyContent="flex-end"
//             padding={3}
//             bgcolor="#E8E8E8"
//             width="100%"
//             height="100%"
//             borderRadius="lg"
//             overflowY="hidden"
//           >
//             {/* messages start */}
//             {loading ? (
//               <CircularProgress
//                 size="large"
//                 sx={{
//                   width: 20,
//                   height: 20,
//                   alignSelf: "center",
//                   margin: "auto",
//                 }}
//               />
//             ) : (
//               <div className="messages">
//                 <ScrollableChat messages={messages} />
//               </div>
//             )}
//             {/* messages end */}
//             {/* Type message and send */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <FormControl sx={{ flex: 1 }}>
//                 <TextField
//                   placeholder="Type Messages Here ..."
//                   variant="outlined"
//                   required
//                   mt={3}
//                   onChange={typingHandler}
//                   value={newMessage}
//                   fullWidth
//                 />
//               </FormControl>
//               <Button variant="contained" color="primary" onClick={sendMessage}>
//                 Send
//               </Button>
//             </Box>
//             {/* type message and send */}
//           </Box>
//         </>
//       ) : (
//         <Box
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           height="100%" // Changed "h" to "height"
//         >
//           <Typography
//             variant="h4" // Corresponds to fontSize="3xl" in Material UI
//             paddingBottom={3}
//             fontFamily="Work sans"
//           >
//             Click on a user to start chatting
//           </Typography>
//         </Box>
//       )}
//     </>
//   );
// };

// export default SingleChat;
