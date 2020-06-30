const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const Joi = require("@hapi/joi");

const dataService = require("../../services/dataService");

const subscribeSchema = Joi.object({
    email: Joi.string().email().required(),
    games: Joi.array()
        .items(Joi.string().valid("gta5", "valorant", "lol").required())
        .required(),
});

router.post("/", async (req, res, next) => {
    try {
        const { error } = subscribeSchema.validate(req.body, {abortEarly: false});

        if (error) {
            throw createError(400, error);
        }

        const dataServiceInstance = new dataService();

        const savedDoc = await dataServiceInstance.addEmailSubscriber(req.body);
        // if undefined => new user
        if (!savedDoc) {
            res.json({ message: "Subscribed" });
        } else {
            res.json({ message: "Updated" });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
