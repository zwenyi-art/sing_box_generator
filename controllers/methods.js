const { Public_servers, SSH, SS, VMESS } = require("../models/Tasks");
const {
  getRandomElements,
  sign_box_config_gen,
} = require("../generator/sign_box_Config_Gen");

const getRandomServers = async (req, res, next) => {
  const data = await Public_servers.find({ tag: "public_servers" });
  const ssh = await SSH.aggregate([
    { $match: { type: "ssh" } }, // Filter documents with type 'ssh'
    { $sample: { size: 1 } }, // Randomly select 1 document
  ]);
  const ss = await SS.aggregate([
    { $match: { type: "shadowsocks" } }, // Filter documents with type 'ssh'
    { $sample: { size: 1 } }, // Randomly select 1 document
  ]);
  console.log("here is getting ", ss);
  const randomServers = await getRandomElements(data[0].servers, 15);
  // sign_box_config_gen(ssh, sign_box_config);
  // for (let i of data) {
  //   const randomServers = await getRandomElements(i.servers, 25); // Get 3 random servers
  //   await sign_box_config_gen(randomServers, sign_box_config);
  // }
  // return sign_box_config;
  const serverData = [...ssh, ...ss, ...randomServers];
  const public_config = await sign_box_config_gen(serverData);
  res.status(200).json(public_config);
};

const getServers = async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  if (id === "123" && token === "abc") {
    const ssh = await SSH.find({});
    const ss = await SS.find({});
    const vmess = await VMESS.find({});
    const servers = [...vmess, ...ssh, ...ss];
    const public_config = await sign_box_config_gen(servers);
    res.status(200).json(public_config);
    // next();
  } else {
    res.status(404).send("Hello,ကောင်ဆိုးလေး");
  }
};

// const msg_response = (res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.status(200).json({ status: "success" });
// };
const addServers = async (req, res) => {
  const { type } = req.body;
  console.log("server hitted", type);
  try {
    if (type === "shadowsocks") {
      const { server, tag, server_port, method, password } = req.body;
      await SS.create({
        type,
        server,
        tag,
        server_port,
        method,
        password,
      });
      console.log(req.body);
    } else if (type === "ssh") {
      const { server, tag, server_port, user, password } = req.body;
      await SSH.create({
        type,
        server,
        tag,
        server_port,
        user,
        password,
      });
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
    } else if (type === "vmess") {
      const {
        server,
        tag,
        server_port,
        uuid,
        security,
        alter_id,
        transport,
        tls,
      } = req.body;
      if (Object.keys(transport).length !== 0) {
        console.log("Hee,transport layer found");
        console.log(
          transport.type,
          transport.path,
          transport.headers,
          transport.headers.host
        );
        const data = await VMESS.create({
          type,
          server,
          tag,
          server_port,
          uuid,
          security,
          alter_id,
          tls,
          transport: {
            type: transport.type,
            path: transport.path,
            headers: transport.headers,
          },
        });
        res.status(200).json({ success: "true", data });
      } else {
        const data = await VMESS.create({
          type,
          server,
          tag,
          server_port,
          uuid,
          security,
          alter_id,
          tls,
        });
        res.status(200).json({ success: "true", data });
      }
    }
  } catch (error) {
    res.status(404).json({ success: "false", error: error });
  }
};

module.exports = { getRandomServers, addServers, getServers };
