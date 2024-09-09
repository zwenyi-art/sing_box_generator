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
      outbounds: ["auto"],
    },
    {
      type: "urltest",
      tag: "auto",
      outbounds: [],
      url: "https://www.gstatic.com/generate_204",
      interval: "1m0s",
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
const { processLargeFile } = require("../generator/bigFileReader");
const dataScraper = require("../generator/fileScraper");

const sing_boxGen = async (req, res) => {
  const url = "https://pad.riseup.net/p/9cjN4e-8-dlnAmfHii2v/export/txt";
  const data = await dataScraper(url);
  await processLargeFile(data, config)
    .then((data) => res.status(200).json(data))
    .catch(console.error);
};

module.exports = sing_boxGen;
