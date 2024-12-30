const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const messageModel = new Schema(
    {
        sender:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content:{
            type: String,
            trim: true
        },
        chat:{
            type: Schema.Types.ObjectId,
            ref: "Chat"
        },
    },
    {timestamps:true}
);

module.exports = model("Message", messageModel);
