const express = require("express");
const sing_boxGen = require("../sing_box_generator/generator/sing_boxGen");
const app = express();
app.get("/api/v1", sing_boxGen);
app.listen(8080, () => {
  console.log("listening on port 8080");
});
