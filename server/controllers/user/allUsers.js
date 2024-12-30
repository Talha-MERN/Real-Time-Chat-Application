const userModel = require("../../models/userModel");

const allUsers = async (req, res) => {
  const { id } = req.userId;
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await userModel.find(keyword).find({
    _id: { $ne: id },
  });
  res.send(users);
};

module.exports = allUsers;
