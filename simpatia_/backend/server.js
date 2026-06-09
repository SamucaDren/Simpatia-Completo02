const express = require("express");
const app = express();

app.get("/api", (req, res) => {
  res.send("<h1>Servidor rodando com ExpressJS</h1>");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
