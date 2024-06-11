const express = require('express')
const Router = express.Router();
const { getAllUser,register,login,refreshToken,findUsers,uploadAvatar,checkInfo,editProfile,changePassword,changePassword1 } = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyMiddleware');

Router.get('/allusers',verifyToken ,getAllUser);
Router.post('/auth/refresh', refreshToken);
Router.post('/auth/register', register);
Router.post('/auth/login', login);
Router.get("/users",verifyToken,findUsers);
Router.post('/uploadAvatar',verifyToken,uploadAvatar);
Router.post('/checkInfo',checkInfo);
Router.post('/editProfile',verifyToken,editProfile);
Router.post('/changePassword',verifyToken,changePassword);
Router.post('/changePassword1',changePassword1);

module.exports = Router;