const Message = require("../../models/messageModel");
const User = require("../../models/userModel");
const Chat = require("../../models/chatModel");

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name profilePicture email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = allMessages;
