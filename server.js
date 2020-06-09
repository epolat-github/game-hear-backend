const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cron = require("node-cron");
const scraperService = require("./services/scraperService");
const dataService = require("./services/dataService");

// every Wednesday
cron.schedule("*/5 * * * *", async () => {
    console.log("Cron job hit");

    const scraper = new scraperService();
    await scraper.scrape();

    console.log("Cron job completed");
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

app.get("/gta5", async (req, res) => {
    const dataServiceInstance = new dataService();

    const foundNews = await dataServiceInstance.getAllNews();

    res.render("allNews", { news: foundNews });
});

// initial info getter path
app.use("/api/gta5", gta5);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
