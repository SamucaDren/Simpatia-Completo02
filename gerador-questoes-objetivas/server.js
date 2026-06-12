require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api/chat", require("./routes/chat"));
app.use("/api/questions", require("./routes/questions"));

app.listen(process.env.PORT, () => {
    console.log("Servidor rodando na porta " + process.env.PORT);
});