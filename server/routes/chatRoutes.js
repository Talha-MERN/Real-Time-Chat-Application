const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const accessChat = require("../controllers/chat/accessChat");
const createGroupChat = require("../controllers/chat/createGroupChat");
const renameGroup = require("../controllers/chat/renameGroup");
const addToGroup = require("../controllers/chat/addToGroup");
const removeFromGroup = require("../controllers/chat/removeFromGroup");
const fetchChats = require("../controllers/chat/fetchChats");

router.route("/").post(authMiddleware, accessChat);
router.route("/").get(authMiddleware, fetchChats);
router.route("/create-group").post(authMiddleware, createGroupChat);
router.route("/rename-group").put(authMiddleware, renameGroup);
router.route("/add-to-group").put(authMiddleware, addToGroup);
router.route("/remove-from-group").put(authMiddleware, removeFromGroup);

module.exports = router;
