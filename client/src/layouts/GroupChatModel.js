import * as React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import toast from "react-hot-toast";
import { useChatStore } from "../stores/chatStore";
import {
  Avatar,
  FormControl,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  TextField,
  List,
} from "@mui/material";
import axios from "axios";
import { userEndpoints } from "../api/endpoints/userEndpoints";
import UserBadgeItem from "./UserBadgeItem";
import { chatEndpoints } from "../api/endpoints/chatEndpoints";

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const GroupChatModel = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [groupChatName, setGroupChatName] = React.useState();
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { chats, setChats } = useChatStore();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      const { data } = await axios.get(userEndpoints.getSearchedUsers(search), {
        headers: {
          "Content-Type": "application/json, multipart/form-data",
        },
        withCredentials: true,
      });
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error fetching users. Please try again.");
    }
  };

  const createChat = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please fill all the fields.");
      return;
    }

    try {
      const { data } = await axios.post(
        chatEndpoints.createGroupChat(),
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setChats([data, ...chats]); // data will be added to the top of the chats.
      handleClose();
      toast.success("New Group Chat Created");
    } catch (error) {
      toast.error("Failed to create the Group Chat");
    }
  };

  const handleDelete = (deleteSelectedUser) => {
    setSelectedUsers(
      selectedUsers.filter(
        (selectedUser) => selectedUser._id !== deleteSelectedUser._id
      )
    );
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.success("User Already Added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    // setSelectedUsers((prev) => {
    //   const updatedUsers = [...prev, userToAdd];
    //   console.log("Updated Users:", updatedUsers); // Log updated users
    //   return updatedUsers;
    // });
  };

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="spring-modal-title" variant="h6" component="h2">
              Create Group chat
            </Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                variant="outlined"
                placeholder="Chat Name"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                variant="outlined"
                placeholder="Add Users e.g., Talha,Omar,Zaid,Ali,Naveed"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box className="w-full flex flex-wrap">
              {selectedUsers.map((u, i) => (
                <UserBadgeItem
                  key={i}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

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
                    onClick={() => handleGroup(user)}
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

            <Button
              variant="contained"
              color="primary"
              onClick={createChat}
              size="medium" // Options: "small", "medium", "large"
            >
              Create Chat
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default GroupChatModel;
