const { decode } = require("jsonwebtoken");
const { decodeToken } = require("../utils/jwtUtils");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(req.cookies.token);
    console.log(decode(token));

    const decodedInfo = decodeToken(token);
    if (decodedInfo) {
      req.userId = decodedInfo;
      next();
    } else {
      res.status(403).send({
        success: true,
        message: "Invalid access!",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: true,
      message: "Something went wrong while verifying authentication.",
    });
  }
};

module.exports = { authMiddleware };
