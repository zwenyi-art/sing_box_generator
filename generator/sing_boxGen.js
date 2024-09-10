const config = {
  log: {
    disabled: false,
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
        geosite: ["category-ads-all"],
        server: "block",
      },
      {
        server: "localDns",
        outbound: "any",
        disable_cache: true,
      },
      {
        geosite: ["cn"],
        server: "localDns",
      },
      {
        server: "localDns",
        clash_mode: "direct",
      },
      {
        server: "proxyDns",
        clash_mode: "global",
      },
      {
        geosite: ["geolocation-!cn"],
        server: "proxyDns",
      },
    ],
    strategy: "ipv4_only",
  },
  inbounds: [
    {
      sniff: true,
      type: "mixed",
      listen: "127.0.0.1",
      listen_port: 1081,
    },
    {
      stack: "system",
      auto_route: true,
      inet4_address: "172.19.0.1/30",
      mtu: 9000,
      sniff: true,
      strict_route: true,
      type: "tun",
      platform: {
        http_proxy: {
          enabled: true,
          server: "127.0.0.1",
          server_port: 1081,
        },
      },
    },
  ],
  outbounds: [
    {
      tag: "select",
      type: "selector",
      outbounds: ["auto"],
    },
    {
      tag: "auto",
      type: "urltest",
      outbounds: ["sghe3"],
      url: "https://www.gstatic.com/generate_204",
      interval: "15m15s",
      tolerance: 50,
    },
    {
      tag: "🌌 Google",
      type: "selector",
      outbounds: ["sghe3"],
    },
    {
      tag: "🌏 !cn",
      type: "selector",
      outbounds: ["direct", "sghe3"],
    },
    {
      tag: "🌏 cn",
      type: "selector",
      outbounds: ["direct", "select"],
    },
    {
      tag: "🛑 AdBlock",
      type: "selector",
      outbounds: ["block", "direct"],
    },
    {
      tag: "direct",
      type: "direct",
    },
    {
      tag: "block",
      type: "block",
    },
    {
      tag: "dns-out",
      type: "dns",
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
        domain: ["v2rayse.com", "cfmem.com", "vpnse.org", "cff.pw", "tt.vg"],
        outbound: "select",
      },
      {
        domain: [
          "clash.razord.top",
          "yacd.metacubex.one",
          "yacd.haishan.me",
          "d.metacubex.one",
        ],
        outbound: "direct",
      },
      {
        geosite: ["google", "github"],
        geoip: ["google"],
        outbound: "🌌 Google",
      },
      {
        geosite: ["geolocation-!cn"],
        outbound: "🌏 !cn",
      },
      {
        geosite: ["cn"],
        geoip: ["private", "cn"],
        outbound: "🌏 cn",
      },
      {
        geosite: ["category-ads-all"],
        outbound: "🛑 AdBlock",
      },
    ],
    auto_detect_interface: true,
    final: "select",
  },
  experimental: {
    cache_file: {
      enabled: true,
      path: "cache.db",
    },
  },
};

const { processLargeFile } = require("../generator/bigFileReader");
const dataScraper = require("../generator/fileScraper");

const sing_boxGen = async (req, res) => {
  const url =
    "https://raw.githubusercontent.com/soroushmirzaei/telegram-configs-collector/main/channels/protocols/shadowsocks";
  const data = await dataScraper(url);
  await processLargeFile(data, config)
    .then((data) => res.status(200).json(data))
    .catch(console.error);
};

module.exports = sing_boxGen;
