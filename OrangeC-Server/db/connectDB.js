const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected MongoDB");
  } catch (error) {
    console.log("Error connectting ...", error.message);
  }
};

module.exports = connectDB;
