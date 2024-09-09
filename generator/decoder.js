const { v4: uuidv4 } = require("uuid");
const generateId = () => uuidv4();
function base64Decode(str) {
  return atob(str.replace(/_/g, "/").replace(/-/g, "+")); // Handle URL-safe Base64 encoding
}
const decodeVlessLink = async (url) => {
  const urlWithoutPrefix = url.replace("vless://", "");
  const [userAndhost, queryStringWithHash] = urlWithoutPrefix.split("/?");
  const [uuid, hostAndport] = userAndhost.split("@");
  const [host, port] = hostAndport.split(":");

  // Parse query string parameters
  const queryParams = new URLSearchParams(queryStringWithHash.split("#")[0]);

  // Hash part after the '#'
  const hashPart = decodeURIComponent(queryStringWithHash.split("#")[1]);

  // Display the parsed information
  const result = {
    uuid: uuid,
    host: host,
    port: port,
    queryParams: Object.fromEntries(queryParams.entries()),
    hash: hashPart,
  };
  console.log(result);
};

const shadowSockLink = async (url) => {
  const urlWithoutPrefix = url.replace("ss://", "");
  const [encodedUserInfo, hostPortWithHash] = urlWithoutPrefix.split("@");
  const [hostPort, hashPart] = hostPortWithHash.split("#");
  const [host, port] = hostPort.split(":");
  const hash = decodeURIComponent(hashPart);
  const userInfo = base64Decode(encodedUserInfo);
  const [method, password] = userInfo.split(":");
  const result = {
    type: "shadowsocks",
    method: method,
    password: password,
    server: host,
    server_port: Number(port),
    tag: String(generateId()),
  };
  if (host === "127.0.0.1") {
    return;
  }
  if (method === "ss") {
    return;
  }
  return result;
};

const decodeTrojanLink = async (url) => {
  const urlWithoutPrefix = url.replace("trojan://", "");
  const [userAndhost, queryStringWithHash] = urlWithoutPrefix.split("/?");
  const [uuid, hostAndport] = userAndhost.split("@");
  const [host, port] = hostAndport.split(":");

  // Parse query string parameters
  const queryParams = new URLSearchParams(queryStringWithHash.split("#")[0]);

  // Hash part after the '#'
  const hashPart = decodeURIComponent(queryStringWithHash.split("#")[1]);

  // Display the parsed information
  const result = {
    uuid: uuid,
    host: host,
    port: port,
    queryParams: Object.fromEntries(queryParams.entries()),
    hash: hashPart,
  };
  console.log(result);
};

const decodeVmessLink = async (url) => {
  const urlWithoutPrefix = url.replace("vmess://", "");
  // const normalText = atob(urlWithoutPrefix);
  const decodedStr = base64Decode(urlWithoutPrefix);
  const vmessConfig = JSON.parse(decodedStr);
  console.log(vmessConfig);
};

module.exports = {
  decodeTrojanLink,
  shadowSockLink,
  decodeVmessLink,
  decodeVlessLink,
};
