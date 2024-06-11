const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    nameGroup: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default:
        "https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/group-user-circle.png",
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    administrators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
