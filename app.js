require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sign_box_config = require("./sign_box_config");
const { autoUpdateServers } = require("./generator/serversGen");
const connectDB = require("./db/connect");
const {
  getRandomServers,
  addServers,
  getServers,
} = require("./controllers/methods");

const path = require("path");

const app = express();

// const testConfig = {
//   log: {
//     disabled: false,
//     level: "info",
//     timestamp: true,
//   },
//   dns: {
//     servers: [
//       {
//         tag: "proxyDns",
//         address: "8.8.8.8",
//         detour: "select",
//       },
//       {
//         tag: "localDns",
//         address: "https://223.5.5.5/dns-query",
//         detour: "direct",
//       },
//       {
//         tag: "block",
//         address: "rcode://success",
//       },
//     ],
//     rules: [
//       {
//         domain: ["ghproxy.com", "cdn.jsdelivr.net", "testingcf.jsdelivr.net"],
//         server: "localDns",
//       },
//       {
//         geosite: ["category-ads-all"],
//         server: "block",
//       },
//       {
//         server: "localDns",
//         outbound: "any",
//         disable_cache: true,
//       },
//       {
//         geosite: ["cn"],
//         server: "localDns",
//       },
//       {
//         server: "localDns",
//         clash_mode: "direct",
//       },
//       {
//         server: "proxyDns",
//         clash_mode: "global",
//       },
//       {
//         geosite: ["geolocation-!cn"],
//         server: "proxyDns",
//       },
//     ],
//     strategy: "ipv4_only",
//   },
//   inbounds: [
//     {
//       sniff: true,
//       type: "mixed",
//       listen: "127.0.0.1",
//       listen_port: 1081,
//     },
//     {
//       stack: "system",
//       auto_route: true,
//       inet4_address: "172.19.0.1/30",
//       mtu: 9000,
//       sniff: true,
//       strict_route: true,
//       type: "tun",
//       platform: {
//         http_proxy: {
//           enabled: true,
//           server: "127.0.0.1",
//           server_port: 1081,
//         },
//       },
//     },
//   ],
//   outbounds: [
//     {
//       tag: "select",
//       type: "selector",
//       outbounds: ["auto"],
//     },
//     {
//       tag: "auto",
//       type: "urltest",
//       outbounds: ["sghe3"],
//       url: "https://www.gstatic.com/generate_204",
//       interval: "10m",
//       tolerance: 50,
//     },
//     {
//       tag: "🌌 Google",
//       type: "selector",
//       outbounds: ["sghe3"],
//     },
//     {
//       tag: "🌏 !cn",
//       type: "selector",
//       outbounds: ["direct", "sghe3"],
//     },
//     {
//       tag: "🌏 cn",
//       type: "selector",
//       outbounds: ["direct", "select"],
//     },
//     {
//       tag: "🛑 AdBlock",
//       type: "selector",
//       outbounds: ["block", "direct"],
//     },
//     {
//       tag: "direct",
//       type: "direct",
//     },
//     {
//       tag: "block",
//       type: "block",
//     },
//     {
//       tag: "dns-out",
//       type: "dns",
//     },
//     {
//       server: "103.253.24.216",
//       server_port: 443,
//       tls: {
//         enabled: true,
//         server_name: "104.17.113.30",
//         insecure: true,
//       },
//       password: "f116cd20-6541-11ef-8c6f-1239d0255272",
//       tag: "sghe3",
//       type: "trojan",
//     },
//   ],
//   route: {
//     geoip: {
//       download_url:
//         "https://github.com/soffchen/sing-geoip/releases/latest/download/geoip.db",
//       download_detour: "select",
//     },
//     geosite: {
//       download_url:
//         "https://github.com/soffchen/sing-geosite/releases/latest/download/geosite.db",
//       download_detour: "select",
//     },
//     rules: [
//       {
//         protocol: "dns",
//         outbound: "dns-out",
//       },
//       {
//         network: "udp",
//         port: 443,
//         outbound: "block",
//       },
//       {
//         clash_mode: "direct",
//         outbound: "direct",
//       },
//       {
//         clash_mode: "global",
//         outbound: "select",
//       },
//       {
//         domain: ["v2rayse.com", "cfmem.com", "vpnse.org", "cff.pw", "tt.vg"],
//         outbound: "select",
//       },
//       {
//         domain: [
//           "clash.razord.top",
//           "yacd.metacubex.one",
//           "yacd.haishan.me",
//           "d.metacubex.one",
//         ],
//         outbound: "direct",
//       },
//       {
//         geosite: ["google", "github"],
//         geoip: ["google"],
//         outbound: "🌌 Google",
//       },
//       {
//         geosite: ["geolocation-!cn"],
//         outbound: "🌏 !cn",
//       },
//       {
//         geosite: ["cn"],
//         geoip: ["private", "cn"],
//         outbound: "🌏 cn",
//       },
//       {
//         geosite: ["category-ads-all"],
//         outbound: "🛑 AdBlock",
//       },
//     ],
//     auto_detect_interface: true,
//     final: "select",
//   },
//   experimental: {
//     cache_file: {
//       enabled: true,
//       path: "cache.db",
//     },
//   },
// };

//automatic update public server with base64 every 24 hours
// autoUpdateServers();

const i_am_vmess = {
  log: {
    level: "info",
    timestamp: true,
  },
  dns: {
    servers: [
      {
        tag: "proxy_dns",
        address: "tls://8.8.8.8/dns-query",
        detour: "select",
      },
      {
        tag: "local_dns",
        address: "h3://223.5.5.5/dns-query",
        detour: "direct",
      },
      {
        tag: "reject",
        address: "rcode://refused",
      },
      {
        tag: "fake_ip",
        address: "fakeip",
      },
    ],
    rules: [
      {
        outbound: "any",
        server: "local_dns",
        disable_cache: true,
      },
      {
        clash_mode: "Global",
        server: "proxy_dns",
      },
      {
        clash_mode: "Direct",
        server: "local_dns",
      },
      {
        rule_set: "geosite-cn",
        server: "local_dns",
      },
      {
        rule_set: "geosite-geolocation-!cn",
        server: "proxy_dns",
      },
      {
        query_type: ["A", "AAAA"],
        rule_set: "geosite-geolocation-!cn",
        server: "fake_ip",
      },
    ],
    final: "proxy_dns",
    fakeip: {
      enabled: true,
      inet4_range: "198.18.0.0/15",
      inet6_range: "fc00::/18",
    },
    independent_cache: true,
  },
  ntp: {
    enabled: true,
    interval: "30m0s",
    server: "time.apple.com",
    server_port: 123,
    detour: "direct",
  },
  inbounds: [
    {
      type: "tun",
      mtu: 9000,
      inet4_address: "172.16.0.1/30",
      inet6_address: "2001:470:f9da:fdfa::1/64",
      auto_route: true,
      strict_route: true,
      endpoint_independent_nat: true,
      sniff: true,
      sniff_override_destination: true,
      domain_strategy: "prefer_ipv4",
    },
  ],
  outbounds: [
    {
      type: "selector",
      tag: "select",
      outbounds: ["url-test", "vmess-ws-tls"],
      default: "url-test",
    },
    {
      type: "urltest",
      tag: "url-test",
      outbounds: ["vmess-ws-tls"],
      url: "https://www.gstatic.com/generate_204",
      interval: "3m0s",
      tolerance: 50,
    },
    {
      type: "vmess",
      tag: "vmess-ws-tls",
      server: "5.253.41.160",
      server_port: 443,
      uuid: "3161fd28-685e-4752-8920-f626496a7e84",
      security: "auto",
      tls: {
        enabled: true,
        server_name: "www.google.com",
        insecure: true,
      },
      transport: {
        type: "ws",
        path: "/RACEVPN",
        headers: {
          host: "www.google.com",
        },
      },
    },
    {
      type: "direct",
      tag: "direct",
    },
    {
      type: "block",
      tag: "reject",
    },
    {
      type: "dns",
      tag: "dns_out",
    },
    {
      type: "selector",
      tag: "AdBlock",
      outbounds: ["reject", "direct"],
    },
  ],
  route: {
    geoip: {
      download_url:
        "https://codeberg.org/axisghost/newGeoDB/raw/branch/main/geoip.db",
      download_detour: "direct",
    },
    geosite: {
      download_url:
        "https://codeberg.org/axisghost/newGeoDB/raw/branch/main/geosite.db",
      download_detour: "direct",
    },
    rules: [
      {
        clash_mode: "Global",
        outbound: "select",
      },
      {
        clash_mode: "Direct",
        outbound: "direct",
      },
      {
        protocol: "dns",
        outbound: "dns_out",
      },
      {
        rule_set: "geosite-category-ads-all",
        outbound: "AdBlock",
      },
      {
        rule_set: "geoip-cn",
        outbound: "direct",
      },
      {
        rule_set: "geosite-cn",
        outbound: "direct",
      },
      {
        ip_is_private: true,
        outbound: "direct",
      },
      {
        rule_set: "geosite-geolocation-!cn",
        outbound: "select",
      },
    ],
    rule_set: [
      {
        type: "remote",
        tag: "geoip-cn",
        format: "binary",
        url: "https://codeberg.org/axisghost/newGeoDB/raw/branch/main/geoip-cn.srs",
        download_detour: "direct",
        update_interval: "24h0m0s",
      },
      {
        type: "remote",
        tag: "geosite-cn",
        format: "binary",
        url: "https://codeberg.org/axisghost/newGeoDB/raw/branch/main/geosite-cn.srs",
        download_detour: "direct",
        update_interval: "24h0m0s",
      },
      {
        type: "remote",
        tag: "geosite-geolocation-!cn",
        format: "binary",
        url: "https://codeberg.org/axisghost/newGeoDB/raw/branch/main/geolocation-%21cn.srs",
        download_detour: "direct",
        update_interval: "24h0m0s",
      },
      {
        type: "remote",
        tag: "geosite-category-ads-all",
        format: "binary",
        url: "https://codeberg.org/axisghost/newGeoDB/raw/branch/main/geosite-category-ads-all.srs",
        download_detour: "direct",
        update_interval: "24h0m0s",
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
    clash_api: {
      external_controller: "127.0.0.1:9090",
    },
  },
};

app.use(express.json());
app.use(cors());
// app.use(
//   "/api/v1/download",
//   express.static(path.join(__dirname, "./file/geoip.db"))
// );

app.post("/api/v1/serverAdd", addServers);
app.get("/api/v1/random", getRandomServers);
app.get("/api/v1/users/:id", getServers);
app.get("/api/v1/vmess", (req, res) => {
  res.status(200).json(i_am_vmess);
});

app.get("/api/v1/download/geoip", (req, res) => {
  const filePath = path.join(__dirname, "./file/geoip.db");
  console.log("download geoip hit ");
  res.status(200).sendFile(filePath);
});
app.get("/api/v1/download/geosite", (req, res) => {
  const filePath = path.join(__dirname, "./file/geosite.db");
  console.log("download geosite hit ");
  res.status(200).sendFile(filePath);
});

app.get("/api/v1/download/geosite-cn", (req, res) => {
  const filePath = path.join(__dirname, "./file/geosite-cn.srs");
  console.log("download geosite cn hit ");
  res.status(200).sendFile(filePath);
});

app.get("/api/v1/download/geolocation-!cn", (req, res) => {
  const filePath = path.join(__dirname, "./file/geolocation-!cn.srs");
  console.log("download geolocation-!cn hit ");
  res.status(200).sendFile(filePath);
});

app.get("/api/v1/download/geosite-category-ads-all", (req, res) => {
  const filePath = path.join(__dirname, "./file/geosite-category-ads-all.srs");
  console.log("download geosite-category-ads-all hit ");
  res.status(200).sendFile(filePath);
});
const start = async () => {
  try {
    await connectDB(process.env.ALL_SERVERS_DB_URL);
    app.listen(process.env.PORT, () => {
      console.log("listening on port 8080");
    });
  } catch (error) {
    console.log(error);
  }
};
start();
