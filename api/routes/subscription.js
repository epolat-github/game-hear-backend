const express = require("express");
const router = express.Router();

const Joi = require("@hapi/joi");

const subscribeSchema = Joi.object({
    email: Joi.string().email().required(),
    games: [Joi.valid("gta", "valorant", "lol").required()],
});

router.post("/", (req, res, next) => {
    
    const { error } = subscribeSchema.validate(req.body);
    
    const { email, games } = req.body;
    
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    console.log(`Subscribed email: ${email}\nSubscribed games:${games}\n`);

    res.json({ message: "Subscribed" });
});

module.exports = router;
