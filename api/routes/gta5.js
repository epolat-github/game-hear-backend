const express = require("express");
const router = express.Router();

// import services
const dataService = require("../../services/dataService");
const fetch = require("../../services/scraperService")

router.get("/", (req, res) => {
    res.send("gta5 root route");
});

router.get("/all", async (req, res) => {
    const dataServiceInstance = new dataService();

    await dataServiceInstance.addMockup();

    const found = await dataServiceInstance.getAllNews();

    res.json(found);
});

router.get("/fetch", async (req, res) => {
    const fetchInstance = new fetch();

    const data = await fetchInstance.scrape();

    res.render("list.pug", {values: data});
});

module.exports = router;
