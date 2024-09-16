const net = require("net");
const { v4: uuidv4 } = require("uuid");
const generateId = () => uuidv4();
function checkShadowsocksConnection(host, port, method, password) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    const startTime = Date.now(); // Start time
    client.connect(port, host, () => {
      const latency = Date.now() - startTime; // Measure latency
      resolve({
        method,
        password,
        host,
        port,
        status: "connected",
        latency: `${latency} ms`,
      });
      client.destroy(); // Close the connection
    });

    client.on("error", (err) => {
      const latency = Date.now() - startTime; // Measure latency
      reject({
        host,
        port,
        method,
        password,
        status: `failed - ${err.message}`,
        latency: `${latency} ms`,
      });
      client.destroy(); // Close the connection
    });
  });
}

async function checkMultipleSS_Servers(servers) {
  const usableServers = [];
  try {
    // Run all server checks in parallel using Promise.all
    const results = await Promise.all(
      servers.map(
        (server) =>
          checkShadowsocksConnection(
            server.host,
            server.port,
            server.method,
            server.password
          ).catch((error) => error) // Handle errors without stopping the rest
      )
    );
    results.forEach((result) => {
      if (result.status === "connected") {
        console.log(
          `Server ${result.host}:${result.port} - Status: ${result.status}, Latency: ${result.latency}`
        );
        const ssConfig = {
          tag: String(generateId()),
          type: "shadowsocks",
          method: result.method,
          password: result.password,
          server: result.host,
          server_port: Number(result.port),
          is_private: false,
        };
        usableServers.push(ssConfig);
      }
    });
    return usableServers;
  } catch (error) {
    console.error(`Error checking servers: ${error}`);
  }
}

module.exports = { checkMultipleSS_Servers };
