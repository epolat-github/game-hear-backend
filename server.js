const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cron = require("node-cron");
require("dotenv").config();

// services
const scraperService = require("./services/scraperService");
const dataService = require("./services/dataService");

// every Friday (site updates Thursday evenings)
cron.schedule("* * * * 5", async () => {
    console.log("Cron job hit");

    const scraper = new scraperService();
    await scraper.scrape(1);

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

// sub-routes
const gta5 = require("./api/routes/gta5");

// middlewares
app.set("view engine", "pug");

// root route
app.get("/", (req, res) => {
    res.send("root");
});

// view routes
app.get("/gta5", async (req, res) => {
    const dataServiceInstance = new dataService();

    const foundNews = await dataServiceInstance.getAllNews();

    res.render("allNews", { news: foundNews });
});

// api paths
app.use("/api/gta5", gta5);

// PORT config
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
