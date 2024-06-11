const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { uploadFile } = require("../service/file.service");

//get all message by id conversation
const getAllMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  // const conversation = await Conversation.findById(conversationId);
  // if (!conversation) {
  //   return res
  //     .status(404)
  //     .json({ success: false, message: "Conversation not found" });
  // }
  const messages = await Message.find({ conversationId })
    .populate("senderId")
    .populate("reaction.userId")
    .exec();
  return res.status(200).json({ success: true, data: messages });
});

const createMessage = async (msg) => {
  try {
    const message = new Message({
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      type: msg.type,
      contentMessage: msg.contentMessage,
      urlType: msg.urlType,
      createAt: msg.createAt,
      isDeleted: msg.isDeleted,
      reaction: msg.reaction,
      isSeen: msg.isSeen,
      isReceive: msg.isReceive,
      isSend: msg.isSend,
      isReCall: msg.isReCall,
      fileName: msg.fileName,
      reply: msg.reply,
    });

    (await message.save()).populate("senderId");

    await Conversation.updateOne(
      { _id: msg.conversationId },
      {
        $push: { messages: message._id },
        $set: { lastMessage: message._id },
        $currentDate: { updatedAt: true },
      }
    );

    return message;
  } catch (error) {
    console.error("Error creating message:", error);
    console.log(error);
    throw error;
  }
};

//lấy 20 tin nhắn gần nhất
const getLastMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res
      .status(404)
      .json({ success: false, message: "Conversation not found" });
  }
  const messages = await Message.find({ conversationId })
    .sort({ createAt: -1 })
    .limit(20);
  messages.reverse();
  return res.status(200).json({ success: true, data: messages });
});

//lấy tất cả tin nhắn trừ 20 tin nhắn gần nhất
const getMoreMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res
      .status(404)
      .json({ success: false, message: "Conversation not found" });
  }
  const messages = await Message.find({ conversationId })
    .sort({ createAt: -1 })
    .skip(20);
  messages.reverse();
  return res.status(200).json({ success: true, data: messages });
});

// get Image messages
const getImageMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Message.find({
    conversationId: conversationId,
    type: "image",
  });
  return res.status(200).json({ success: true, data: messages });
});

// get Video messages
const getVideoMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Message.find({
    conversationId: conversationId,
    type: "video",
  });
  return res.status(200).json({ success: true, data: messages });
});

// get file messages
const getFileMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Message.find({
    conversationId: conversationId,
    type: "file",
  });
  return res.status(200).json({ success: true, data: messages });
});

const uploadFiles = asyncHandler(async (req, res) => {
  console.log(req.file);
  try {
    const file = req.file;
    console.log(file);
    const url = await uploadFile(file);
    return res.status(200).json({ success: true, data: url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// create reaction message
const createReaction = asyncHandler(async (r) => {
  // const {messageId,userId,reactType} = req.body;
  const message = await Message.findById(r.messageId);
  if (!message) {
    throw new Error("Khong tim thay msg!");
  }
  const existingReaction = message.reaction.find(
    (reaction) => reaction.userId.toString() === r.userId.toString()
  );
  if (existingReaction) {
    existingReaction.type = r.reactType;
  } else {
    message.reaction.push({ userId: r.userId, type: r.reactType });
  }
  await message.save();
});
// recall message
const recallMessage = asyncHandler(async (msg) => {
  const message = await Message.findById(msg.messageId);
  if (!message) {
    throw new Error("Message not found");
  }
  message.isReCall = true;
  await message.save();
});

//delete message
const deleteMessage = asyncHandler(async (msg) => {
  const message = await Message.findById(msg.messageId);
  if (!message) {
    throw new Error("Message not found");
  }
  message.deleteBy = [...message.deleteBy, msg.userDelete];
  console.log(message.deleteBy);
  await message.save();
});

module.exports = {
  getAllMessage,
  createMessage,
  uploadFiles,
  createReaction,
  getLastMessage,
  getMoreMessage,
  recallMessage,
  deleteMessage,
  getImageMessages,
  getVideoMessages,
  getFileMessages,
};
