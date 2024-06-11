const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getJwt = (email, userId) => {
  const payload = {
    email,
    userId,
  };
  const token = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: "7d" });
  return token;
};

//refresh token
const refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(403).json("Access is forbidden - Missing refreshToken");
  }
  jwt.verify(refreshToken, process.env.SECRETKEY, (err, user) => {
    if (err) {
      return res.status(403).json("Access is forbidden - Invalid refreshToken");
    }
    console.log(user);
    const accessToken = getJwt(user.email, user.userId);
    return res.status(200).json({ accessToken });
  });
};

//get all user
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ message: error });
  }
});

//up avatar
const uploadAvatar = asyncHandler(async (req, res) => {
  const { userId, image } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    throw new Error("User not found");
  }
  user.image = image;
  await user.save();
  res.status(200).json({ message: "Upload successfully" });
});

//register user
const register = asyncHandler(async (req, res) => {
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    image: req.body.image,
    gender: req.body.gender,
    password: req.body.password,
    active: true,
  });
  const existingEmail = await User.findOne({ email: req.body.email });
  if (existingEmail) {
    res.status(400).json({ message: "Email already exists" });
    throw new Error("Email already exists");
  }
  // const existingPhone = await User.findOne({ phone: req.body.phone });
  // if (existingPhone) {
  //   res.status(400).json({ message: "Phone already exists" });
  //   throw new Error("Phone already exists");
  // }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;
  await user.save();


  const userRespones = await User.findOne({ _id: user._id });
  const accessToken = getJwt(user.email, user._id);

  res.status(200).json({
    message: "ok",
    userRespones,
    accessToken: accessToken,
  });
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const existingEmail = await User.findOne({ email: username });
  if (!existingEmail) {
    res.status(200).json({ message: "email" });
    // throw new Error("Email not found");
  }
  const validPassword = await bcrypt.compare(password, existingEmail.password);
  if (!validPassword) {
    res.status(200).json({ message: "password" });
    // throw new Error("Email or Password is incorrect");
  }
  const user = await User.findOne({ _id: existingEmail._id });
  const accessToken = getJwt(username, existingEmail._id);

  res.status(200).json({
    message: "ok",
    user,
    accessToken: accessToken,
  });
});
// find user
const findUsers = asyncHandler(async (req, res) => {
  const { keyword, userId } = req.query;
  let result = null;
  if (/\d+/.test(keyword)) {
    result = await User.find({ phone: keyword, _id: { $ne: userId } });
    if (!result) {
      res.status(403).json({ success: false, message: "Not found" });
      throw new Error("Not found");
    }
  } else {
    result = await User.find({
      name: { $regex: keyword, $options: "i" },
      _id: { $ne: userId },
    });
    if (!result) {
      res.status(403).json({ success: false, message: "Not found" });
      throw new Error("Not found");
    }
  }
  res.status(200).json({ success: true, data: result });
});

//ham check sdt va email da ton tai chua
const checkInfo = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existingEmail = await User.findOne({ email: email });
  if (existingEmail) {
    res.status(200).json({ message: "email" });
  } else {
    res.status(200).json({ message: "ok" });
  }
});
// ham chinh sua thong tin ca nhan
const editProfile = asyncHandler(async (req, res) => {
  const { userId, name, dateOfBirth, gender } = req.body;
  console.log('req.body', req.body);
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    throw new Error("User not found");
  }
  user.name = name;
  user.dateOfBirth = dateOfBirth;
  user.gender = gender;
  await user.save();
  res.status(200).json({ message: "ok", user });
});


const changePassword = asyncHandler(async (req, res) => {
  const { userId, oldpassword, password } = req.body;
  console.log('req.body', req.body);
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    throw new Error("User not found");
  }
  const validPassword = await bcrypt.compare(oldpassword, user.password);
  if (!validPassword) {
    res.status(200).json({ message: "sai" });
    throw new Error("Old password is incorrect");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({ message: "ok" });
});

const changePassword1 = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log('req.body', req.body);
  const user = await User.findOne({ email});
  if (!user) {
    res.status(404).json({ message: "email" });
    throw new Error("User not found");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({ message: "ok" });
});



module.exports = { getAllUser, register, login, refreshToken, findUsers, uploadAvatar, checkInfo, editProfile, changePassword,changePassword1 };
