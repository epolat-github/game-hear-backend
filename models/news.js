const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create news schema
const NewSchema = new Schema({
    scrapeDate: {
        type: Date,
        default: Date.now(),
    },
    newDate: {
        type: Date,
        required: true,
        unique: true,
    },
    newHeader: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    news: [Schema.Types.Mixed],
    // news: {
    //     type: [String],
    // },
});

NewSchema.post("save", (doc) => {
    console.log(`${doc._id} saved`);
});

module.exports = newsModel = mongoose.model("weeklyNew", NewSchema);
