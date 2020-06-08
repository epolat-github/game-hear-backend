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
        let newsHolder = [];
        const $ = await this.fetchSite();
        const allSections = $(".wiki-section");

        allSections.each((index, elem) => {
            const heading = $(elem).find("h2 > span.mw-headline").text();
            const image = $(elem).find("img").attr("src");
            const news = $(elem).find("li").text();

            if (heading != "") {
                newsHolder.push({ heading, images: [], news: [] });
            }

            else if(image != undefined) {
                const [baseUrl, parameters] = image.split("?", 2);
                newsHolder[newsHolder.length - 1].images.push(baseUrl)
            }
            
            else if (news != "") {
                newsHolder[newsHolder.length - 1].news.push(news)
            }

        });

        return newsHolder;
    }
}

module.exports = scraperService;
