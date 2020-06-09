const express = require("express");
const router = express.Router();

// import services
const dataService = require("../../services/dataService");
const scraperService = require("../../services/scraperService");

router.get("/", (req, res) => {
    res.send("gta5 root route");
});

router.get("/all", async (req, res) => {
    const dataServiceInstance = new dataService();

    const foundNews = await dataServiceInstance.getAllNews();

    res.status(200).json(foundNews);
});

router.get("/scrape", async (req, res, next) => {
    try {
        const scraper = new scraperService();
        const count = await scraper.scrape();
        console.log("Scraped ", count);

        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
