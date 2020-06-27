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

    async scrape(count = undefined) {
        try {
            let newsHolder = [];
            const $ = await this.fetchSite();
            const allSections = $(".wiki-section");

            allSections.each((_, elem) => {
                const header = $(elem).find("h2 > span.mw-headline").text();
                const image = $(elem).find("img").attr("src");
                const news = $(elem).find("li");

                // Header of the Week
                if (header != "") {
                    // desired count
                    if ((count != undefined) & (newsHolder.length == count)) {
                        return false;
                    }

                    // initial header format of IGN's GTA5 page=> "date:header"
                    const [date, splittedHeader] = header.split(":");
                    newsHolder.push({
                        header: splittedHeader.trim(),
                        date: this.stringToDate(date),
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
                else if (news.length != 0) {
                    //TODO separate bold single news topic and its bullets
                    const update = {
                        topic: "",
                        items: [],
                    };

                    // parse bold topic
                    const topic = $(news).find("b");
                    update.topic = topic.text().replace(":", "");

                    // parse list items
                    const items = $(news).html().split("<br>");

                    items.forEach((item) => {
                        // if the item is plain text without any tags involved, cheerio throws error.
                        // But we need all of them except the bold ones.
                        try {
                            // const newItem = `<p>${item}</p>`;
                            if (!$(item).is("b")) {
                                // even the item has no tags in it, it can still get in this if clause.
                                // for some reason, .text() might return empty string.
                                const text = $(item).text();
                                if (text != "") {
                                    update.items.push(text);
                                } else {
                                    update.items.push(item);
                                }
                            }
                        } catch (err) {
                            update.items.push(item);
                        }
                        // console.log("ITEM: ", item);
                        // console.log(
                        //     "ARRAY: ",
                        //     update.items[update.items.length - 1]
                        // );
                        // console.log("\n\n");
                    });

                    newsHolder[newsHolder.length - 1].news.push(update);
                }
            });

            // update db
            const dataServiceInstance = new dataService();
            const updatedDocCount = await dataServiceInstance.updateDatabase(newsHolder);
            return updatedDocCount;
        } catch (err) {
            throw err;
        }
    }

    stringToDate(dateString) {
        const yearRegex = /\d\d\d\d/;
        const dayRegex = /\d{1,2}/;

        const day = dateString.match(dayRegex);
        const year = dateString.match(yearRegex);
        const month = dateString.split(" ")[0];

        const weekDate = new Date(day + month + year);

        return weekDate;
    }
}

module.exports = scraperService;
