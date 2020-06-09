const scraperService = require("./scraperService");

const dateTest = () => {
    const scraper = new scraperService();

    const dateStrings = [
        "May 28, 2020",
        "Apr. 16, 2020",
        "Sept. 26 - Oct. 2, 2019",
    ];
    const formattedDates = [];

    dateStrings.forEach((date) => {
        formattedDates.push(scraper.stringToDate(date));
    });

    formattedDates.forEach((date, index) => {
        console.log(`${dateStrings[index]} => ${date.toDateString()}`)
    });
};

dateTest();
