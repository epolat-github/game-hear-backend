const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const singleNew = new Schema({
    topic: {
        type: String,
        required: true,
    },
    items: {
        type: [String],
        required: true,
    },
});

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
    newFeaturedImage: {
        type: String,
    },
    news: {
        type: [singleNew],
        default: undefined
    }
});

module.exports = newsModel = mongoose.model("weeklyNew", NewSchema);
module.exports = singleNewModel = mongoose.model("singleNew", singleNew)
