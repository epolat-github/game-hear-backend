const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cron = require("node-cron");
const scraperService = require("./services/scraperService");

// every Wednesday
cron.schedule("* * * * * 3", async () => {
    const scraper = new scraperService();
    await scraper.scrape();
});

// init DB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("DB connection error: ", err));

// init routes
const gta5 = require("./api/routes/gta5");

// middlewares
app.set("view engine", "pug");

// routes
app.get("/", (req, res) => {
    res.send("root");
});

// initial info getter path
app.use("/api/gta5", gta5);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
