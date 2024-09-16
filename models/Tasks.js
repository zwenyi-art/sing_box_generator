const mongoose = require("mongoose");

const Public_SSserverSchema = new mongoose.Schema({
  type: { type: String, required: true },
  server: { type: String, required: true },
  server_port: { type: Number, required: true },
  method: { type: String, required: true },
  password: { type: String, required: true },
});

const SSserverSchema = new mongoose.Schema({
  type: { type: String, required: true },
  server: { type: String, required: true },
  server_port: { type: Number, required: true },
  method: { type: String, required: true },
  password: { type: String, required: true },
  tag: { type: String, required: true },
});
const SshServerSchema = new mongoose.Schema({
  type: { type: String, required: true },
  server: { type: String, required: true },
  server_port: { type: Number, required: true },
  user: { type: String, required: true },
  password: { type: String, required: true },
  tag: { type: String, required: true },
});

const PublicServersSchema = new mongoose.Schema({
  servers: {
    type: [Public_SSserverSchema], // Array of server configurations
    default: [], // Default to an empty array
  },
  tag: { type: String },
});

const SSHSERVER = new mongoose.Schema({
  servers: {
    type: [SshServerSchema], // Array of server configurations
    default: [], // Default to an empty array
  },
  tag: { type: String },
});

const ServersSchema = new mongoose.Schema({
  type: { type: String, required: true },
  server: { type: String, required: true },
  server_port: { type: Number, required: true },
  method: { type: String, required: true },
  password: { type: String, required: true },
  tag: { type: String },
  is_private: { type: Boolean },
});
const Public_servers = mongoose.model("public", PublicServersSchema);
const SSH = mongoose.model("ssh_server", SshServerSchema);
const SS = mongoose.model("ss_server", SSserverSchema);
module.exports = { Public_servers, SSH, SS };
