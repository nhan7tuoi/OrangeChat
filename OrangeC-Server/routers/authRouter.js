const express = require('express')
const Router = express.Router();
const { verifycation,forgotPassword} = require('../controllers/authController');

Router.post('/auth/verifycation', verifycation);
Router.post('/forgotpassword', forgotPassword);

module.exports = Router;