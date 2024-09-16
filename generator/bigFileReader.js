const {
  decodeTrojanLink,
  decodeVlessLink,
  decodeVmessLink,
  shadowSockLink,
} = require("../generator/decoder");
async function processLargeFile(filePath) {
  const servers = [];
  try {
    // Decode base64 line
    const decodedLine = Buffer.from(filePath, "base64")
      .toString("utf-8")
      .split("\n");
    for (let decodedConfig of decodedLine) {
      const result = decodedConfig.match(/(.*):\/\//)[1];
      // console.log(result);
      if (result === "ss") {
        shadowSockLink(decodedConfig).then((data) => {
          if (data) {
            servers.push(data);
          }
        });
      } else if (result === "vless") {
        decodeVlessLink(decodedConfig);
      } else if (result === "trojan") {
        decodeTrojanLink(decodedConfig);
      } else if (result === "vmess") {
        decodeVmessLink(decodedConfig);
      } else {
        console.log("Not support");
      }
    }
  } catch (error) {
    console.error("Error decoding line or matching protocol:", error);
  }
  console.log("File processing completed.");
  return servers;
}

module.exports = { processLargeFile };
