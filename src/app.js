const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const imageRoutes = require("./routes/imgae.routes")

const app = express();

app.use(express.static(path.join(__dirname, "../client")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/images",imageRoutes)

module.exports = app;