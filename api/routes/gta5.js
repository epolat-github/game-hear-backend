const express = require("express");
const router = express.Router();

// import services
const dataService = require("../../services/dataService");
const scraperService = require("../../services/scraperService");

router.get("/", (req, res) => {
    res.send("gta5 root route");
});

router.get("/news/:count", async (req, res, next) => {
    try {
        const dataServiceInstance = new dataService();

        const count = req.params.count;

        let foundNews;

        // TODO mongodb .limit(0) returns all the data. Might no need to getAllNews() at all
        if (count === "all") {
            foundNews = await dataServiceInstance.getAllNews();
            return res.status(200).json(foundNews);
        } else {
            foundNews = await dataServiceInstance.getCountOfNews(Number(count));
            return res.status(200).json(foundNews);
        }
    } catch (err) {
        next(err);
    }
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
