const express = require("express");
const router = express.Router();
const registerUser = require("./../controllers/user/registerUser");
const loginUser = require("./../controllers/user/loginUser");
const { authMiddleware } = require("../middlewares/authMiddleware");
const allUsers = require("../controllers/user/allUsers");

router.post("/registration", registerUser);
router.post("/login", loginUser);
router.get("/all-users", authMiddleware, allUsers);

module.exports = router;
