const mongoose = require("mongoose");

const stickerSchema = new mongoose.Schema({
  title: String,
  data: [{ id:String,url:String }],
});

const Sticker = mongoose.model("Sticker", stickerSchema);
module.exports = Sticker;
