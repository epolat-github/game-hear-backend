const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv").config();

// services
const scraperService = require("./services/scraperService");
const dataService = require("./services/dataService");

// every Friday (site updates Thursday evenings)
// const cronExpression = "* * */12 * * *";
// cron.schedule(cronExpression, async () => {
//     console.log("Cron job hit");
//     const scraper = new scraperService();
//     try {
//         await scraper.scrape(1);
//     } catch (err) {
//         return console.error("Cron job error: ", err.stack);
//     }
//     console.log("Cron job completed");
// });

// init DB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("DB connection error: ", err));

// sub-routes
const gta5 = require("./api/routes/gta5");
const subscribe = require("./api/routes/subscription");

// middlewares
app.set("view engine", "pug");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root route
app.get("/", (req, res) => {
    res.send("root");
});

// TEST ROUTE
const emailService = require("./services/emailService");
app.get("/test", async (req, res, next) => {
    try {
        const email = new emailService();
        await email.sendUpdateEmail("gta5");
        res.json("done");
    } catch (err) {
        next(err);
    }
});

// view routes
app.get("/gta5", async (req, res) => {
    const dataServiceInstance = new dataService();

    const foundNews = await dataServiceInstance.getAllNews();

    res.render("allNews", { news: foundNews });
});

// api paths
app.use("/api/gta5", gta5);
app.use("/api/subscribe", subscribe);

// favicon error handler
app.get("/favicon.ico", (req, res) => res.sendStatus(204));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message });
    // res.status(err.status || 500);
    // res.json({ error: err.message });
});

// PORT config
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
