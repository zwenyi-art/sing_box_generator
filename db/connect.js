const mongoose = require("mongoose");
const connectiongString =
  "mongodb://axis_ghost:axis_ghost@cluster0-shard-00-00.6onrc.mongodb.net:27017,cluster0-shard-00-01.6onrc.mongodb.net:27017,cluster0-shard-00-02.6onrc.mongodb.net:27017/shadowSockServers?ssl=true&replicaSet=atlas-h6j4di-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

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
