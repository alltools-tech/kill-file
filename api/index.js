const express = require("express");
const app = express();
app.get("/health", (req, res) => res.json({status: "ok"}));
app.listen(8080, () => console.log("API running on 8080"));