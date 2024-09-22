const mongoose = require("mongoose");

const Public_SSserverSchema = new mongoose.Schema({
  type: { type: String, required: true },
  server: { type: String, required: true },
  server_port: { type: Number, required: true },
  method: { type: String, required: true },
  password: { type: String, required: true },
});

//shadowsocks schema for personal
const SSserverSchema = new mongoose.Schema({
  type: { type: String, required: true },
  server: { type: String, required: true },
  server_port: { type: Number, required: true },
  method: { type: String, required: true },
  password: { type: String, required: true },
  tag: { type: String, required: true },
});

//ssh server schema for personal
const SshServerSchema = new mongoose.Schema({
  type: { type: String, required: true },
  server: { type: String, required: true },
  server_port: { type: Number, required: true },
  user: { type: String, required: true },
  password: { type: String, required: true },
  tag: { type: String, required: true },
});

//vmess server schema for personal
const VmessServerSchema = new mongoose.Schema({
  type: { type: String, required: true },
  tag: { type: String, required: true },
  server: { type: String, required: true },
  server_port: { type: Number, required: true },
  uuid: { type: String, required: true },
  security: { type: String, required: true },
  alter_id: { type: Number, required: true },
  tls: {
    enabled: { type: Boolean },
    insecure: { type: Boolean, default: true },
    server_name: { type: String },
  },
  transport: {
    type: { type: String },
    path: { type: String },
    headers: {
      host: { type: String },
    },
  },
});

//public shadowsocks server schema
const PublicServersSchema = new mongoose.Schema({
  servers: {
    type: [Public_SSserverSchema], // Array of server configurations
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
const VMESS = mongoose.model("vmess_server", VmessServerSchema);
module.exports = { Public_servers, SSH, SS, VMESS };
