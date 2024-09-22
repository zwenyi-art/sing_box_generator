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
        tag: "proxy_dns",
        address: "https://8.8.8.8/dns-query",
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
    } else if (data.type === "vmess") {
      const {
        type,
        server,
        tag,
        server_port,
        uuid,
        security,
        alter_id,
        transport,
        tls,
      } = data;
      if (transport.type) {
        sign_box_config.outbounds.push({
          type,
          server,
          tag,
          server_port,
          uuid,
          security,
          alter_id,
          transport,
          tls,
        });
      } else {
        sign_box_config.outbounds.push({
          type,
          server,
          tag,
          server_port,
          uuid,
          security,
          alter_id,
        });
      }

      sign_box_config.outbounds[0].outbounds.push(tag);
      sign_box_config.outbounds[1].outbounds.push(tag);
    }
  }

  return sign_box_config;
};

module.exports = { getRandomElements, sign_box_config_gen };
