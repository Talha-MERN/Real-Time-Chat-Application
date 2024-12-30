import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Visibility from "@mui/icons-material/Visibility";
import Close from "@mui/icons-material/Close";
import { useChatStore } from "../stores/chatStore";
import toast from "react-hot-toast";
import UserBadgeItem from "./UserBadgeItem";
import {
  Avatar,
  Button,
  FormControl,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  TextField,
} from "@mui/material";
import { chatEndpoints } from "../api/endpoints/chatEndpoints";
import axios from "axios";
import { userEndpoints } from "../api/endpoints/userEndpoints";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "50%", lg: "40%" }, // responsive width
  maxWidth: "600px", // max width limit
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const user = localStorage.getItem("userInfo");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  // const chats = JSON.parse(localStorage.getItem("Chat Store"));
  const { selectedChat, setSelectedChat, chats } = useChatStore();

  const [groupChatName, setGroupChatName] = React.useState();
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [renameLoading, setRenameLoading] = React.useState(false);

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast.error("Only Admin can remove someone.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        chatEndpoints.removeFromGroup(),
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (error) {
      toast.error("Error Occured");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.error("User is already in the group.");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only Admin can add someone.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        chatEndpoints.addToGroup(),
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error("Error Occured");
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (event) => {
    event.preventDefault();
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const { data } = await axios.put(
        chatEndpoints.renameGroup(),
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error("Error Occured");
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      const { data } = await axios.get(userEndpoints.getSearchedUsers(search), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error fetching users. Please try again.");
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen} aria-label="open modal">
        <Visibility />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* Close button positioned in the top-right corner */}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            {selectedChat.chatName}
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              pb: 3,
            }}
          >
            {selectedChat.users.map((u, i) => (
              <UserBadgeItem
                key={i}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>
          <Box
            component="form"
            onSubmit={handleRename}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2, // space between input and button
            }}
          >
            <TextField
              label="New Group Name"
              variant="outlined"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              sx={{ flex: 1 }} // input will expand to take available space
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              isLoading={renameLoading}
              //   onClick={handleRename}
            >
              Rename
            </Button>
          </Box>
          {/* /////////////////////////////////////////////////////////////////////////////////// */}

          {/* <Box
            component="form"
            // onSubmit={handleSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            className="mt-5"
          >
            <TextField
              label="Add users to group"
              variant="outlined"
              onChange={(e) => handleSearch(e.target.value)}
              sx={{ flex: 1 }} // input will expand to take available space
            />
          </Box> */}

          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              placeholder="Add Users e.g., Talha,Omar,Zaid,Ali,Naveed"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>

          {loading ? (
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
            </Box>
          ) : (
            <List>
              {searchResult?.slice(0, 4).map((user, index) => (
                <ListItem
                  key={index}
                  user={user}
                  alignItems="flex-start"
                  onClick={() => handleAddUser(user)}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                >
                  <ListItemAvatar>
                    {/* Assuming user.image is the URL of the profile picture */}
                    <Avatar alt={user.name} src={user.profilePicture} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.email} />
                </ListItem>
              ))}
            </List>
          )}

          {/* ////////////////////////////////////////////////////////////////////////////////////// */}
          <Box className="mt-5 flex justify-end">
            <Button
              type="submit"
              variant="contained"
              color="error"
              isLoading={renameLoading}
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
          </Box>
          {/* //////////////////////////////////////////////////////////////////////////////////////////////// */}
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModal;
