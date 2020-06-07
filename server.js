const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

// init DB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("DB connection error: ", err));

// init routes
const gta5 = require("./routes/gta5");

// routes
app.get("/", (req, res) => {
    res.send("root");
});

// initial info getter path
app.use("/api/gta5", gta5);
