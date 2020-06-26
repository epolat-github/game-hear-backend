const newsModel = require("../models/news");
const subscribersModel = require("../models/subscribers");

class dataService {
    constructor() {}

    // get all news data
    async getAllNews() {
        const found = await newsModel
            .find({})
            .select({ _id: 0, scrapeDate: 0 })
            .sort({ newDate: -1 });

        return found;
    }

    async getCountOfNews(count) {
        const found = await newsModel
            .find({})
            .select({ _id: 0, scrapeDate: 0 })
            .sort({ newDate: -1 })
            .limit(count);

        return found;
    }

    async updateDatabase(news) {
        try {
            if (news.length != 1) {
                // purge the collection first
                await newsModel.deleteMany({});
            }
            // add new data
            news.forEach(async (newsData) => {
                const newWeeklyNews = new newsModel({
                    newDate: newsData.date,
                    newHeader: newsData.header,
                    images: newsData.images,
                    news: newsData.news,
                });

                try {
                    await newWeeklyNews.save();
                } catch (err) {
                    throw err;
                }
            });
        } catch (err) {
            throw err;
        }
    }

    async addEmailSubscriber({ email, games }) {
        console.log(email, games);
        try {
            await subscribersModel.findOneAndUpdate(
                { email },
                { games },
                {
                    new: true,
                    upsert: true,
                }
            );
        } catch (err) {
            throw err;
        }
    }
}

module.exports = dataService;
