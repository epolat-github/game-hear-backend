const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Create news schema
const NewSchema = new Schema({
    scrapeDate: {
        type: Date,
        default: Date.now(),
    },
    newDate: {
        type: String,
    },
    newHeader: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    news: {
        type: [String],
    },
});

module.exports = newsModel = mongoose.model("weeklyNew", NewSchema);
