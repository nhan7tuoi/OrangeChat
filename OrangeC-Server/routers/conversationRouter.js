const express = require("express");
const Router = express.Router();
const {
  createConversation,
  getConversationByUserId,
  getAllConversationByUserId,
  uploadAvatarGroup,
  getConversationGroupsByUserId,
  getOneConversation,
} = require("../controllers/conversationController");

Router.post("/addconversation", createConversation);
//param userId
Router.get("/conversation/:userId", getConversationByUserId);
Router.get("/allConversations/:userId", getAllConversationByUserId);
Router.post("/uploadAvatarGroup", uploadAvatarGroup);
Router.get("/getConversationGroups/:userId", getConversationGroupsByUserId);
Router.get("/getOneConversation/:senderId/:receiverId", getOneConversation);

module.exports = Router;
