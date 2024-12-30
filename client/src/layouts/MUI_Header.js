import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import InputBase from "@mui/material/InputBase";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { userEndpoints } from "../api/endpoints/userEndpoints";
import { chatEndpoints } from "../api/endpoints/chatEndpoints";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "../stores/chatStore";
import { useNavigate } from "react-router-dom";

// Search bar styles for inside the drawer
const SearchBar = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  display: "flex",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: "100%",
}));

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false); // Drawer state
  const [users, setUsers] = React.useState([]); // List of users
  const [loading, setLoading] = React.useState(false); // Loading state for skeleton
  const [searchTerm, setSearchTerm] = React.useState(""); // Search input value
  const [loadingChat, setLoadingChat] = React.useState(false);

  const { selectedChat, setSelectedChat, chats, setChats } = useChatStore();
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token or perform any other cleanup
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
    navigate("/"); // Redirect to the home page
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
    if (!open) {
      setUsers([]); // Clear user list when drawer closes
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a name to search!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        userEndpoints.getSearchedUsers(searchTerm),
        {
          headers: {
            "Content-Type": "application/json, multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setUsers(response.data); // Assuming response.data contains the user list
      // console.log(users);
    } catch (error) {
      toast.error("Error fetching users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const response = await axios.post(
        chatEndpoints.accessChats(),
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (!chats.find((c) => c._id === response.data._id))
        setChats([response.data, ...chats]);
      setSelectedChat(response.data); // from state management
      // setLoadingChat(false);
      // onClose();
      // toggleDrawer(false);
    } catch (error) {
      toast.error("Error fetching the chat");
    } finally {
      setLoadingChat(false);
      setDrawerOpen(false); // Close the drawer here
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const drawerList = (
    <Box sx={{ width: 300, padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Search Users
      </Typography>

      {/* Search bar inside the drawer */}
      <SearchBar>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search users…"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button variant="contained" sx={{ ml: 1 }} onClick={handleSearch}>
          Search
        </Button>
      </SearchBar>

      {/* Skeleton during loading */}
      {loading ? (
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
          <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
        </Box>
      ) : (
        <List>
          {users.map((user, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              onClick={() => accessChat(user._id)}
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
      {loadingChat && <CircularProgress className="flex" />}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Search Button */}
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={toggleDrawer(true)}
            sx={{ marginRight: 2 }}
          >
            Search Users
          </Button>

          {/* Center the title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            RTC-MERN
          </Typography>

          {/* Right side components */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar alt="User Name" src="/path/to/profile/image.jpg" />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {renderMenu}

      {/* Side Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </Box>
  );
}
