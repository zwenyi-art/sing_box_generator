const { v4: uuidv4 } = require("uuid");
const generateId = () => uuidv4();
const sign_box_config = {
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
      interval: "5m0s",
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
//Fisher-Yates shuffle algorithm
//getting random elements from array for use public servers
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
  for (let j of array_index) {
    result.push(array[j]);
  }
  return result;
}
const sign_config_clear = async (servers) => {
  if (sign_box_config.outbounds[1].outbounds.length > 0) {
    sign_box_config.outbounds[0].outbounds.splice(
      1,
      sign_box_config.outbounds[0].outbounds.length
    );
    sign_box_config.outbounds[1].outbounds.splice(
      0,
      sign_box_config.outbounds[1].outbounds.length
    );
    sign_box_config.outbounds.splice(6, sign_box_config.outbounds.length);
  }
};

const sign_box_config_gen = async (servers) => {
  console.log("generator");
  await sign_config_clear(servers);
  for (let data of servers) {
    if (data.type === "shadowsocks") {
      console.log(data);
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
      if (data.tag) {
        const { tag, type, server, server_port, method, password } = data;
        sign_box_config.outbounds.push({
          tag,
          type,
          server,
          server_port,
          method,
          password,
        });
        sign_box_config.outbounds[0].outbounds.push(tag);
        sign_box_config.outbounds[1].outbounds.push(tag);
      } else {
        const ss = {
          type: data.type,
          server: data.server,
          server_port: data.server_port,
          method: data.method,
          password: data.password,
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
    } else if (data.type === "ssh") {
      const { tag, type, server, server_port, user, password } = data;
      sign_box_config.outbounds.push({
        tag,
        type,
        server,
        server_port,
        user,
        password,
      });
      sign_box_config.outbounds[0].outbounds.push(tag);
      sign_box_config.outbounds[1].outbounds.push(tag);
      // console.log({ tag, type, server, server_port, user, password });
    }
  }

  return sign_box_config;
};

module.exports = { getRandomElements, sign_box_config_gen };
