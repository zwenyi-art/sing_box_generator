const { Public_servers } = require("../models/Tasks");
const {
  getRandomElements,
  sign_box_config_gen,
} = require("../generator/sign_box_Config_Gen");
const sign_box_config = require("../sign_box_config");
const getServers = async (type) => {
  const data = await Public_servers.find({ tag: type });
  for (let i of data) {
    const randomServers = await getRandomElements(i.servers, 25); // Get 3 random servers
    await sign_box_config_gen(randomServers, sign_box_config);
  }
  return sign_box_config;
};

module.exports = { getServers };
