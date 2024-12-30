const userModel = require("../../models/userModel");
const { comparePassword } = require("../../utils/bcryptUtils");
const { generateToken } = require("../../utils/jwtUtils");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.fields;

    const user = await userModel.findOne({ email });
    if (user) {
      const isPasswordCorrect = await comparePassword(password, user.password);
      if (isPasswordCorrect) {
        const token = generateToken({ id: user._id });
        // console.log(token);

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 1000 * 60 * 60 * 12,
        });

        res.status(200).send({
          success: true,
          message: "User logged in succesfully!",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Invalid credentials!",
        });
      }
    } else {
      res.status(404).send({
        success: true,
        message: "User does not exist. Please signup first!",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong at server while logging in the user.",
      error,
    });
  }
};

module.exports = loginUser;
