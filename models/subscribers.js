const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailSubscriber = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    games: {
        type: [String],
        require: true,
    },
});

EmailSubscriber.post("save", (doc) => {
    console.log(
        `Subscribed email: ${doc.email}\nSubscribed games:${doc.games}\n`
    );
});

module.exports = subscribersModel = mongoose.model("emailSub", EmailSubscriber);
