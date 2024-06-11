const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

const getConversationByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversation.find({
      members: userId,
      isGroup: false,
    })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .exec();
    return res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, data: [] });
  }
});

const getOneConversation = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const conversation = await Conversation.findOne({
      isGroup: false,
      members: { $all: [senderId, receiverId] },
    })
      .populate("members")
      .populate("lastMessage")
      .exec();
    return res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false });
  }
});

const createConversation = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    // Kiểm tra xem cuộc trò chuyện đã tồn tại giữa sender và receiver chưa
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (conversation) {
      // Nếu cuộc trò chuyện đã tồn tại, trả về dữ liệu cuộc trò chuyện đã tồn tại
      return res.status(200).json({ success: true, data: conversation });
    }
    // Nếu cuộc trò chuyện chưa tồn tại, tạo một cuộc trò chuyện mới
    const newConversation = new Conversation({
      members: [senderId, receiverId],
      messages: [],
    });
    // Lưu cuộc trò chuyện mới vào cơ sở dữ liệu
    await newConversation.save();
    // Tạo tin nhắn mới và thiết lập conversationId
    const message = new Message({
      conversationId: newConversation._id,
      senderId,
      receiverId,
      type: "first",
    });
    // Lưu tin nhắn mới vào cơ sở dữ liệu
    await message.save();
    // Thêm tin nhắn mới vào danh sách tin nhắn của cuộc trò chuyện
    newConversation.messages.push(message);
    // Lưu lại cuộc trò chuyện với tin nhắn mới vào cơ sở dữ liệu
    await newConversation.save();

    // Trả về dữ liệu của cuộc trò chuyện mới tạo
    return res.status(200).json({ success: true, data: newConversation });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

const addConversation = async (c) => {
  try {
    let conversation;
    if (c.isGroup === false) {
      conversation = new Conversation({
        nameGroup: c.nameGroup,
        isGroup: c.isGroup,
        members: c.members,
        administrators: c.administrators,
        messages: [],
      });
    } else {
      conversation = new Conversation({
        nameGroup: c.nameGroup,
        isGroup: c.isGroup,
        members: c.members,
        administrators: c.administrators,
        image: c.image,
        messages: [],
      });
    }

    await conversation.save();
    const message = new Message({
      conversationId: conversation._id,
      senderId: conversation.members[0],
      receiverId: conversation.members[1],
      type: "first",
    });
    await message.save();
    conversation.messages.push(message);
    await conversation.save();
    return conversation.populate("members");
  } catch (error) {
    console.log("error create conversation: ", error);
    throw error;
  }
};

const getAllConversationByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversation.find({
      members: userId,
    })
      .populate("members")
      .exec();
    return res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, data: [] });
  }
});

const getConversationGroupsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversation.find({
      members: userId,
      isGroup: true,
    })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .exec();
    return res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, data: [] });
  }
});

const uploadAvatarGroup = asyncHandler(async (req, res) => {
  const { conversationId, image } = req.body;
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404).json({ message: "Conversation not found" });
    throw new Error("Conversation not found");
  }
  conversation.image = image;
  await conversation.save();
  res.status(200).json({ message: "Upload successfully", data: conversation });
});

module.exports = {
  createConversation,
  getConversationByUserId,
  addConversation,
  getAllConversationByUserId,
  uploadAvatarGroup,
  getConversationGroupsByUserId,
  getOneConversation,
};
