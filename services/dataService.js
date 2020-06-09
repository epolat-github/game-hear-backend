const newsModel = require("../models/news");

class dataService {
    constructor() {}

    // get all news data
    async getAllNews() {
        const found = await newsModel
            .find({})
            .select({ _id: 0, scrapeDate: 0 });

        return found;
    }

    async updateDatabase(news) {
        // purge the collection first
        await newsModel.deleteMany({});

        // add new data
        news.forEach(async (newsData) => {
            const newWeeklyNews = new newsModel({
                newDate: newsData.date,
                newHeader: newsData.header,
                images: newsData.images,
                news: newsData.news,
            });

            const saveNews = await newWeeklyNews.save();
        });
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
