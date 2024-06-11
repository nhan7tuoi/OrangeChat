const asyncHandler = require("express-async-handler");
const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// send friend request
const sendFriendRequest = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;
  const friendRequest = new FriendRequest({
    senderId,
    receiverId,
  });
  await friendRequest.save();
  res.status(200).json({ success: true, message: "ok" });
});

// accept
const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updateResult = await FriendRequest.updateOne(
    { _id: id },
    { $set: { state: "accepted" } }
  );
  if (updateResult.nModified === 0) {
    return res
      .status(404)
      .json({ sucess: false, message: "id not found or no changes applied" });
  }

  res.status(200).json({ sucess: true, message: "Updated successfully" });
});
// reject
const rejectFriendRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleteResult = await FriendRequest.deleteOne({ _id: id });
  if (deleteResult.deletedCount === 0) {
    return res.status(404).json({ success: false, message: "Id not found" });
  }
  res.status(200).json({ success: true, message: "Deleted successfully" });
});
// get all friends of user
const getFriends = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const listFriendRequests = await FriendRequest.find({
    state: "accepted",
    $or: [{ senderId: userId }, { receiverId: userId }],
  });
  if (!listFriendRequests) {
    return res.status(404).json({
      sucess: false,
      message: "Not found",
    });
  }
  let listFriends = [];
  await Promise.all(
    listFriendRequests.map(async (fq) => {
      let friendUserId = fq.senderId.equals(userId)
        ? fq.receiverId
        : fq.senderId;
      const user = await User.findById(friendUserId);
      if (user) {
        listFriends.push(user);
      }
    })
  );
  listFriends.sort((a, b) => a.name.localeCompare(b.name));
  res.status(200).json({ sucess: true, data: listFriends });
});
const getAllFriendRequests = asyncHandler(async (req, res) => {
  const {userId} = req.params;
  const listFriendRequests = await FriendRequest.find({
    state: "pending",
    $or: [{ senderId: userId }, { receiverId: userId }],
  });
  if (!listFriendRequests) {
    return res.status(404).json({
      sucess: false,
      message: "Not found",
    });
  }
  res.status(200).json({ sucess: true, data: listFriendRequests });
});
// get all friend requests of user
const getFriendRequests = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const listFriendRequests = await FriendRequest.find({
    state: "pending",
    receiverId: userId,
  })
    .populate("senderId")
    .exec();
  if (!listFriendRequests) {
    return res.status(404).json({
      sucess: false,
      message: "Not found",
    });
  }
  res.status(200).json({ sucess: true, data: listFriendRequests });
});

//delete friend by senderId and receciverId
const deleteFriend = asyncHandler(async (req, res) => {
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;

  const deleteResult = await FriendRequest.findOneAndDelete({
    $or: [
      { senderId: senderId, receiverId: receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });
  if (deleteResult.deletedCount === 0) {
    return res.status(404).json({ success: false, message: "Id not found" });
  }
  res.status(200).json({ success: true, message: "Deleted successfully" });
});
module.exports = {
  sendFriendRequest,
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriend,
  getAllFriendRequests
};
