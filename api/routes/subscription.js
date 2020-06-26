const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const Joi = require("@hapi/joi");

const dataService = require("../../services/dataService");

const subscribeSchema = Joi.object({
    email: Joi.string().email().required(),
    games: Joi.array().items(Joi.string().valid("gta5", "valorant", "lol").required()).required(),
});

router.post("/", async (req, res, next) => {
    try {
        const { error } = subscribeSchema.validate(req.body);

        if (error) {
            throw createError(400, error.message);
            // return res.status(400).json({ message: error.message });
        }

        const dataServiceInstance = new dataService();

        await dataServiceInstance.addEmailSubscriber(req.body);

        res.json({ message: "Subscribed" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
