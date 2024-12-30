const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: /.+@.+\..+/,
    },
    password: {
      type: String,
      minLength: [8, "Password cannot be less than 8 characters."],
      required: true,
    },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userModel);
