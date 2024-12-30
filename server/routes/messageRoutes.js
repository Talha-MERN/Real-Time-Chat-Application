const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const sendMessage = require("../controllers/message/sendMessage");
const allMessages = require("../controllers/message/allMessages");

router.route("/").post(authMiddleware, sendMessage);
router.route("/:chatId").get(authMiddleware, allMessages);

module.exports = router;
