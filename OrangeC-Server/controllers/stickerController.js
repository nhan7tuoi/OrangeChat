const asyncHandler = require("express-async-handler");
const Sticker = require("../models/Sticker");

const stickerData = [
    {
        title: 'Animals',
        data: [
            {
                id: 1,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
            {
                id: 2,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
        ],
    },
    {
        title: 'Emotions',
        data: [
            {
                id: 1,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
            {
                id: 2,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
            {
                id: 3,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
            {
                id: 4,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
            {
                id: 5,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
            {
                id: 6,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
            {
                id: 7,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
            {
                id: 8,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
            {
                id: 9,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
            {
                id: 10,
                url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
            },
        ],
    },
];

//get all sticker
const getAllSticker = asyncHandler(async (req, res) => {
    try {
        const stickers = await Sticker.find();
        res.json(stickers);
    } catch (error) {
        res.json({ message: error });
    }
});

//create sticker
const createSticker = asyncHandler(async (req, res) => {
    const sticker = new Sticker({
        title: req.body.title,
        data: req.body.data,
    });
    await sticker.save();
    res.status(201).json(sticker);
});

//update sticker
const updateSticker = asyncHandler(async (req, res) => {
    const sticker = await Sticker.findById(req.params.id);
    if (sticker) {
        sticker.title = req.body.title || sticker.title;
        sticker.data = req.body.data || sticker.data;
        await sticker.save();
        res.json(sticker);
    } else {
        res.status(404).json({ message: "Sticker not found" });
    }
}
);

//delete sticker
const deleteSticker = asyncHandler(async (req, res) => {
    const sticker = await Sticker.findById(req.params.id);
    if (sticker) {
        await sticker.remove();
        res.json({ message: "Sticker removed" });
    } else {
        res.status(404).json({ message: "Sticker not found" });
    }
});

module.exports = { getAllSticker, createSticker, updateSticker, deleteSticker };