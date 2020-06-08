const axios = require("axios");
const cheerio = require("cheerio");

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
        const newsHeaders = $(".wiki-section");
        // console.log("Size: ", newsHeaders.length);
        newsHeaders.each((index, element) => {
            headers.push($(element).text());
            // console.log($(element).text())
        });
        return headers;
    }
}

module.exports = scraperService;
