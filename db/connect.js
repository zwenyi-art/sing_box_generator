const mongoose = require("mongoose");
mongoose.connection.on("connected", () => console.log("connected"));
mongoose.connection.on("open", () => console.log("open"));
mongoose.connection.on("connecting", () => console.log("connecting"));
mongoose.connection.on("disconnected", () => console.log("disconnected"));

const connectDB = async (URL) => {
  return mongoose
    .connect(URL)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
