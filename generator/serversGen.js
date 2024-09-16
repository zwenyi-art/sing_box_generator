const config = {
  log: {
    level: "info",
    timestamp: true,
  },
  dns: {
    servers: [
      {
        tag: "proxyDns",
        address: "8.8.8.8",
        detour: "select",
      },
      {
        tag: "localDns",
        address: "https://223.5.5.5/dns-query",
        detour: "direct",
      },
      {
        tag: "block",
        address: "rcode://success",
      },
    ],
    rules: [
      {
        domain: ["ghproxy.com", "cdn.jsdelivr.net", "testingcf.jsdelivr.net"],
        server: "localDns",
      },
      {
        geosite: "category-ads-all",
        server: "block",
      },
      {
        outbound: "any",
        server: "localDns",
        disable_cache: true,
      },
      {
        geosite: "cn",
        server: "localDns",
      },
      {
        clash_mode: "direct",
        server: "localDns",
      },
      {
        clash_mode: "global",
        server: "proxyDns",
      },
      {
        geosite: "geolocation-!cn",
        server: "proxyDns",
      },
    ],
    strategy: "ipv4_only",
  },
  inbounds: [
    {
      type: "mixed",
      listen: "127.0.0.1",
      listen_port: 1081,
      sniff: true,
    },
    {
      type: "tun",
      mtu: 9000,
      inet4_address: "172.19.0.1/30",
      auto_route: true,
      strict_route: true,
      stack: "system",
      platform: {
        http_proxy: {
          enabled: true,
          server: "127.0.0.1",
          server_port: 1081,
        },
      },
      sniff: true,
    },
  ],
  outbounds: [
    {
      type: "selector",
      tag: "select",
      outbounds: ["auto", "sghe3"],
    },
    {
      type: "urltest",
      tag: "auto",
      outbounds: ["sghe3"],
      url: "https://www.gstatic.com/generate_204",
      interval: "20m0s",
      tolerance: 50,
    },
    {
      type: "direct",
      tag: "direct",
    },
    {
      type: "block",
      tag: "block",
    },
    {
      type: "dns",
      tag: "dns-out",
    },
    {
      type: "selector",
      tag: "AdBlock",
      outbounds: ["block", "direct"],
    },
    {
      tag: "🌌 Google",
      type: "selector",
      outbounds: ["sghe3"],
    },
    {
      server: "103.253.24.216",
      server_port: 443,
      tls: {
        enabled: true,
        server_name: "104.17.113.30",
        insecure: true,
      },
      password: "f116cd20-6541-11ef-8c6f-1239d0255272",
      tag: "sghe3",
      type: "trojan",
    },
  ],
  route: {
    geoip: {
      download_url:
        "https://github.com/soffchen/sing-geoip/releases/latest/download/geoip.db",
      download_detour: "select",
    },
    geosite: {
      download_url:
        "https://github.com/soffchen/sing-geosite/releases/latest/download/geosite.db",
      download_detour: "select",
    },
    rules: [
      {
        protocol: "dns",
        outbound: "dns-out",
      },
      {
        network: "udp",
        port: 443,
        outbound: "block",
      },
      {
        clash_mode: "direct",
        outbound: "direct",
      },
      {
        clash_mode: "global",
        outbound: "select",
      },
      {
        geosite: ["google", "github"],
        geoip: ["google"],
        outbound: "🌌 Google",
      },
      {
        geosite: "category-ads-all",
        outbound: "AdBlock",
      },
    ],
    final: "select",
    auto_detect_interface: true,
  },
  experimental: {
    cache_file: {
      enabled: true,
      path: "cache.db",
    },
  },
};
const { checkMultipleSS_Servers } = require("./checkssServer");
const usableServers = [];
const { processLargeFile } = require("./bigFileReader");
const dataScraper = require("./fileScraper");
const { Public_servers, SSH } = require("../models/Tasks");

const updatePublicServer = async (data) => {
  const updateData = `{
        tag:"public_servers",
      },
      { servers: ${data} },
      {
        new: true,
        runValidators: true,
      }`;
  const server = await Public_servers.findOneAndUpdate(updateData);
  console.log(server);
};
const servers_Gen = async () => {
  const url =
    "https://raw.githubusercontent.com/soroushmirzaei/telegram-configs-collector/main/channels/protocols/shadowsocks";
  try {
    //stage 1
    const data = await dataScraper(url);
    //stage 2
    console.log("data scraping");
    const servers = await processLargeFile(data).catch(console.error);
    //stage 3
    console.log("checking");
    const checkedServers = await checkMultipleSS_Servers(servers);
    // await addServers(checkedServers, "public_servers");
    // await addServers(checkedServers, serverType);
    await updatePublicServer(checkedServers);
    //final stage
    console.log("completed updating public severs");
  } catch (error) {
    console.log(error);
  }
};
const interval = 24 * 60 * 60 * 1000;
const autoUpdateServers = async () => {
  // Your function logic here
  await servers_Gen();
};

// Start the interval for the test (runs every 2 minutes)
setInterval(autoUpdateServers, interval);
module.exports = { autoUpdateServers };
