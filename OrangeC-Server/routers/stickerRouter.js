const express = require('express')
const Router = express.Router();
const { getAllSticker,createSticker,deleteSticker,updateSticker } = require('../controllers/stickerController');
const verifyToken = require('../middlewares/verifyMiddleware');

Router.get('/allstickers', getAllSticker);
Router.post('/createSticker',  createSticker);
Router.post('/deleteSticker', deleteSticker);
Router.post('/updateSticker', updateSticker);

module.exports = Router;
