const express = require("express");
const cors = require("cors");
const path = require("path");
const sing_boxGen = require("./generator/sing_boxGen");
const app = express();
const geoip = path.resolve(__dirname, "./file/geoip.db");
const geosite = path.resolve(__dirname, "./file/geosite.db");

app.use(cors());
app.get("/api/v1", sing_boxGen);
// app.get("/download/geoip", (req, res) => {
//   res.download(geoip, "geoip.db", (err) => {
//     if (err) {
//       console.error("Error sending file:", err);
//       res.status(500).send("Error downloading file");
//     }
//   });
// });
// app.get("/download/geosite", (req, res) => {
//   res.download(geosite, "geosite.db", (err) => {
//     if (err) {
//       console.error("Error sending file:", err);
//       res.status(500).send("Error downloading file");
//     }
//   });
// });
app.listen(8080, () => {
  console.log("listening on port 8080");
});
