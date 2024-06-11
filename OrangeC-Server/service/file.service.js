require("dotenv").config();
const { s3 } = require("../utils/aws-helper");

const randomString = numberCharacter => {
    return `${Math.random()
        .toString(36)
        .substring(2, numberCharacter + 2)}`
}

const FILE_TYPE_MATCH = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "application/pdf",
    "application/msword",
    "video/mp4"
];

const uploadFile = async file => {
    const filePath = `${randomString(4)}-${new Date().getTime()}-${file?.originalname}`;
    console.log(file.mimetype);
    if (FILE_TYPE_MATCH.indexOf(file.mimetype) === -1) {
        throw new Error(`${file?.originalname} is invalid!`);
    }

    const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Body: file?.buffer,
        Key: filePath,
        ContentType: file?.mimetype,
    };
    try {
        const data = await s3.upload(uploadParams).promise();

        console.log(`File uploaded successfully. ${data.Location}`);
        return data.Location;

        // const fileName = `${process.env.CLOUDFRONT_URL}${data.Key}`;

        // return fileName;
    } catch (err) {
        console.error("Error uploading file to AWS S3:", err);
        throw new Error("Upload file to AWS S3 failed");
    }
};

module.exports = {
    uploadFile,
};