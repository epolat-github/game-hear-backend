const axios = require("axios");
const cheerio = require("cheerio");

// db models
const newsModels = require("../models/news");
const singleNewModel = newsModels.singleNewModel;
const weeklyNewModel = newsModels.newsModel;

class scraperService {
    constructor() {
        this.url = "https://www.ign.com/wikis/gta-5/GTA_Online_Weekly_Updates";
    }

    async fetchSite() {
        const result = await axios.default.get(this.url);

        return cheerio.load(result.data);
    }

    async scrape() {
        let headers = [];
        const $ = await this.fetchSite();
        const news = $(".wiki-section");

        let newWeeklyNew = null;

        news.each((index, element) => {
            // parse weekly new headings
            const foundHeader = $(element).find("h2>.mw-headline");

            if (foundHeader.length != 0) {
                const [weekDate, weekHeading] = foundHeader
                    .text()
                    .split(":", 2);

                weekHeading.trim();
                weekDate.trim();

                newWeeklyNew = new weeklyNewModel({
                    newDate: weekDate,
                    newHeader: weekHeading,
                     
                })



            } else if (foundHeader.length == 0 && newWeeklyNew != null) {
                headers.push(newWeeklyNew);
                newWeeklyNew = null;
            }

            headers.push(newWeeklyNew);
        });
        return headers;
    }
}

module.exports = scraperService;
