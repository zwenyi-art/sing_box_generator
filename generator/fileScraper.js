const https = require("https");

const dataScraper = async (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];
      let totalSize = 0;

      // Handle incoming data chunks
      response.on("data", (chunk) => {
        chunks.push(chunk); // Store each chunk in an array
        totalSize += chunk.length;
        console.log(`Received chunk of size: ${chunk.length}`);
      });

      // When all data is received
      response.on("end", () => {
        // Concatenate all chunks into a single buffer
        const data = Buffer.concat(chunks, totalSize);
        resolve(data.toString()); // Convert buffer to string or return buffer as needed
      });

      // Handle errors
      response.on("error", (err) => {
        reject(`Error during download: ${err.message}`);
      });
    });
  });
};

// Export the function to use in another module
module.exports = dataScraper;
