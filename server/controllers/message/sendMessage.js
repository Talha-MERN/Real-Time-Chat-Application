const Message = require("../../models/messageModel");
const User = require("../../models/userModel");
const Chat = require("../../models/chatModel");

const sendMessage = async (req, res) => {
  const { id } = req.userId;
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid Data passed into request.");
    return res.sendStatus(404);
  }

  var newMessage = {
    sender: id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name profilePicture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePicture email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = sendMessage;
