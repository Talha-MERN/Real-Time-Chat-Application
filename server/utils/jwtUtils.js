const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (text) => {
  try {
    return jwt.sign(text, secretKey, { expiresIn: "5d" });
  } catch (error) {
    console.log("Something went wrong while generating token. ERR:", error);
  }
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log("Something went wrong while decoding token. ERR:", error);
  }
};

module.exports = { generateToken, decodeToken };
