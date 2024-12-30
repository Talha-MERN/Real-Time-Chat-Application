const userModel = require("../../models/userModel");
const { hashPassword } = require("../../utils/bcryptUtils");
const fs = require("fs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.fields;
    const { profilePicture } = req.files;

    // const userExists = await userModel.findOne({ email });

    // if (userExists) {
    //   res.status(400);
    //   throw new Error("User already exists");
    // }

    const newUser = new userModel({
      name,
      email,
      password: await hashPassword(password),
    });

    if (profilePicture) {
      newUser.profilePicture.data = fs.readFileSync(profilePicture.path);
      newUser.profilePicture.contentType = profilePicture.type;
    }

    await newUser.save();
    // console.log(newUser);

    res.status(201).send({
      success: true,
      message: "User registered succesfully!",
      _id: newUser._id,
      name,
      email,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong at server while registering the user.",
      error,
    });
  }
};

module.exports = registerUser;
