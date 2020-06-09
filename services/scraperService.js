const axios = require("axios");
const cheerio = require("cheerio");

// services
const dataService = require("./dataService");

class scraperService {
    constructor() {
        this.url = "https://www.ign.com/wikis/gta-5/GTA_Online_Weekly_Updates";
    }

    // fetch the given url data
    async fetchSite() {
        const result = await axios.default.get(this.url);

        return cheerio.load(result.data);
    }

    async scrape() {
        let newsHolder = [];
        const $ = await this.fetchSite();
        const allSections = $(".wiki-section");

        allSections.each((_, elem) => {
            const header = $(elem).find("h2 > span.mw-headline").text();
            const image = $(elem).find("img").attr("src");
            const news = $(elem).find("li").text();

            // Header of the Week
            if (header != "") {
                // initial header format of IGN's GTA5 page=> "date:header"
                const [date, splittedHeader] = header.split(":");
                newsHolder.push({
                    header: splittedHeader,
                    date,
                    images: [],
                    news: [],
                });
            }

            // Image src url of the week
            else if (image != undefined) {
                // url comes with the query parameters: width=250 etc.
                const [baseUrl, parameters] = image.split("?", 2);
                newsHolder[newsHolder.length - 1].images.push(baseUrl);
            }

            // Every single news of the week
            else if (news != "") {
                // normally it has a bold topic and list of that topic per news. 
                // Pushed without seperation.
                newsHolder[newsHolder.length - 1].news.push(news);
            }
        });

        // update db
        const dataServiceInstance = new dataService();
        await dataServiceInstance.updateDatabase(newsHolder);
    }
}

module.exports = scraperService;
