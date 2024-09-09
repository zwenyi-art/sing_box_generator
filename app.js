const express = require("express");
const cors = require("cors");
const sing_boxGen = require("./generator/sing_boxGen");
const app = express();
app.use(cors());
app.get("/api/v1", sing_boxGen);
app.listen(8080, () => {
  console.log("listening on port 8080");
});
