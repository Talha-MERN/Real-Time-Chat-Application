import { Visibility } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Avatar,
} from "@mui/material";
import { useState } from "react";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen} style={{ display: "flex" }}>
          <Visibility />
        </IconButton>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogTitle
          style={{
            fontSize: "40px",
            fontFamily: "Work sans",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {user.name}
        </DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            height: "250px",
          }}
        >
          <Avatar
            src={user.pic}
            alt={user.name}
            style={{ width: "150px", height: "150px" }}
          />
          <Typography
            variant="h6"
            style={{ fontSize: "28px", fontFamily: "Work sans" }}
          >
            Email: {user.email}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileModal;
