import React from "react";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        px={2}
        py={1}
        borderRadius="8px"
        m={1}
        mb={2}
        fontSize={12}
        bgcolor="purple" // background color
        color="white" // text color
        sx={{ cursor: "pointer" }}
        onClick={handleFunction}
      >
        {user.name}
        <CloseIcon sx={{ paddingLeft: 1 }} />
      </Box>
    </>
  );
};

export default UserBadgeItem;
