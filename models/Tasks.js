const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  type: { type: String, required: true },
  server: { type: String, required: true },
  server_port: { type: Number, required: true },
  method: { type: String, required: true },
  password: { type: String, required: true },
});

const TaskSchema = new mongoose.Schema({
  servers: {
    type: [serverSchema], // Array of server configurations
    default: [], // Default to an empty array
  },
  tag: { type: String },
});

const Public_servers = mongoose.model("public", TaskSchema);
module.exports = { Public_servers };
