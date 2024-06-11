const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/User");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORDAPP,
    },
});

const handledSendMailCode = async (code, email) => {
    try {
        await transporter.sendMail({
            from: `"OrangeChat" <${process.env.EMAIL}>`,
            to: email,
            subject: "Verifycation Email Code",
            text: "Your code to verify email",
            html: `Code: <b>${code}</b>`,
        });
        return 'ok'
    } catch (error) {
        return 'no ok';
    }
}

const verifycation = asyncHandler(async (req, res) => {
    const { username } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000);
    try {
        await handledSendMailCode(code, username);
        res.status(200).json({
            message: "ok",
            data: {
                code: code,
            }
        });
    } catch (error) {
        res.json({ message: error });
    }
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ email: username });
    if (!user) {
        res.status(200).json({ message: "email" });
        throw new Error("Email not found");
    }else{
        const code = Math.floor(100000 + Math.random() * 900000);
        try {
            await handledSendMailCode(code, username);
            res.status(200).json({
                message: "ok",
                data: {
                    code: code,
                }
            });
        } catch (error) {
            res.json({ message: error });
        }
    }
});

module.exports = { verifycation, forgotPassword }