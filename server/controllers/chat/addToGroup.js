const chatModel = require("../../models/chatModel");

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat not Found");
  } else {
    res.json(added);
  }
};

module.exports = addToGroup;
