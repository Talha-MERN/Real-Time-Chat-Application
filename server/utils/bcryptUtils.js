const bcrypt = require("bcrypt");

const hashPassword = (password) => {
  try {
    return bcrypt.hash(password, 10);
  } catch (error) {
    console.log(
      `Something went wrong while hashing the password. ERR:${error}`
    );
  }
};

const comparePassword = (password, hashedPassword) => {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log(
      `Something went wrong while comparing the passwords. ERR:${error}`
    );
  }
};

module.exports = { hashPassword, comparePassword };
