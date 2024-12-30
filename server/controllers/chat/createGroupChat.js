const chatModel = require("../../models/chatModel");

const createGroupChat = async (req, res) => {
  const { id } = req.userId;

  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields." });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat.");
  }

  users.push(id);
  //   console.log(id);

  try {
    const groupChat = await chatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: id,
    });

    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    console.log(fullGroupChat);

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = createGroupChat;
