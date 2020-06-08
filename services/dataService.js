const newsModel = require("../models/news");

class dataService {
    constructor() {}

    // get all news data
    async getAllNews() {
        const found = await newsModel.find({});

        found.map((item) => item.toObject);

        console.log(found);

        return found;
    }

    async addMockup() {
        for (let i = 0; i < 5; i++) {
            const newNews = new newsModel({
                newHeader: `deneme${i}`,
                news: [
                    {
                        topic: "topicdeneme",
                        items: ["items1", "items2"],
                    },
                ],
            });
            const saved = await newNews.save();
            console.log("Saved: ", saved);
        }
    }
}

module.exports = dataService;
