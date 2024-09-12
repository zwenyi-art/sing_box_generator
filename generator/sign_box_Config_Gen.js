const { v4: uuidv4 } = require("uuid");
const generateId = () => uuidv4();
//Fisher-Yates shuffle algorithm
async function getRandomElements(array, numElements) {
  const array_index = [];
  const result = [];
  const length = array.length;
  for (let i = 0; i < numElements; i++) {
    const randomIndex = Math.floor(Math.random() * length);
    if (!array_index.includes(randomIndex)) {
      array_index.push(randomIndex);
    }
    // result.push(array[randomIndex]);
  }
  console.log(array_index);
  for (let j of array_index) {
    result.push(array[j]);
  }
  console.log(result);
  return result;
}

const sign_box_config_gen = async (servers, sign_box_config) => {
  for (let server of servers) {
    if (server.type === "shadowsocks") {
      const methodList = [
        "2022-blake3-aes-128-gcm",
        "2022-blake3-aes-256-gcm",
        "2022-blake3-chacha20-poly1305",
        "none",
        "aes-128-gcm",
        "aes-192-gcm",
        "aes-256-gcm",
        "chacha20-ietf-poly1305",
        "xchacha20-ietf-poly1305",
        "aes-128-ctr",
        "aes-192-ctr",
        "aes-256-ctr",
        "aes-128-cfb",
        "aes-192-cfb",
        "aes-256-cfb",
        "rc4-md5",
        "chacha20-ietf",
        "xchacha20",
      ];
      const ss = {
        type: server.type,
        server: server.server,
        server_port: server.server_port,
        method: server.method,
        password: server.password,
        tag: String(generateId()),
      };
      if (ss.server === "127.0.0.1") {
        return;
      }
      if (!methodList.includes(ss.method)) {
        return;
      }
      sign_box_config.outbounds.push(ss);
      sign_box_config.outbounds[1].outbounds.push(ss.tag);
    }
  }
  return sign_box_config;
};

module.exports = { getRandomElements, sign_box_config_gen };
