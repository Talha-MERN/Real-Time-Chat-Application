const chatModel = require("../../models/chatModel");

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not Found");
  } else {
    res.json(updatedChat);
  }
};

module.exports = renameGroup;
