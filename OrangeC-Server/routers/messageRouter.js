const express = require("express");
const Router = express.Router();
const {
  getAllMessage,
  uploadFiles,
  createReaction,
  getLastMessage,
  getMoreMessage,
  getImageMessages,
  getVideoMessages,
  getFileMessages,
} = require("../controllers/messageController");
const upload = require("../middlewares/uploadMiddleware");

//get message theo conversationId
Router.get("/messages/:conversationId", getAllMessage);
Router.post("/files/upload", upload, uploadFiles);
Router.post("/message/reaction", createReaction);
Router.get("/messages/last/:conversationId", getLastMessage);
Router.get("/messages/more/:conversationId", getMoreMessage);
Router.get("/messages/image/:conversationId", getImageMessages);
Router.get("/messages/video/:conversationId", getVideoMessages);
Router.get("/messages/file/:conversationId", getFileMessages);
module.exports = Router;
