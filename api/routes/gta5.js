const express = require("express");
const router = express.Router();

// import services
const dataService = require("../../services/dataService");

router.get("/", (req, res) => {
    res.send("gta5 root route");
});

router.get("/all", async (req, res) => {
    const dataServiceInstance = new dataService();

    await dataServiceInstance.addMockup();

    const found = await dataServiceInstance.getAllNews();

    res.json(found);
});

module.exports = router;
