const express = require("express");
const router = express.Router();

// import services
const dataService = require("../../services/dataService");
const scraperService = require("../../services/scraperService")

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
    

});

module.exports = router;
