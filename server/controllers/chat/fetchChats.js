const chatModel = require("../../models/chatModel");
const userModel = require("../../models/userModel");

const fetchChats = async (req, res) => {
  const { id } = req.userId;

  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name profilePicture email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = fetchChats;
