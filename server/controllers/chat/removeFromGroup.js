const chatModel = require("../../models/chatModel");

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat not Found");
  } else {
    res.json(removed);
  }
};

module.exports = removeFromGroup;
