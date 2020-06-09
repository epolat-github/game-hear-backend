# GameHear - Backend
---
> ### An Express server that scrapes game websites periodically for their patch updates.

# Start point
To run the Node server locally:
* Clone this repository
* `npm install` to install all the dependencies
* Install [MongoDB](https://docs.mongodb.com/manual/installation/#tutorials) locally or use [Atlas](https://www.mongodb.com/cloud/atlas)
* Create `.env` file and put your MongoDB connection string as `MONGO_URI`
* `npm run dev` to start development server

## Technologies
Used technologies:
* NodeJs, Express - Handling HTTP requests
* MongoDB - Database to hold scraped data
* Mongoose - ODM 
* Axios - Fetching website data
* Cheerio - Scraping data
* Pug - Templating the scraped data

## Structure
* `server.js` - Entry point of the server.
* `api/` - Folder that contains API routes and middlewares.
* `api/routes/` - Folder that contains route definitions. 
* `models/` - Folder that defines the Mongoose models.
* `services/` - Business logic of the server. Contains data service and scraper service currently.
* `views/` - Holds Pug templates to visualize the scraped data.

## Endpoints
* `/gta5` - Renders the Pug template that contains scraped data.
* `/api/gta5/all` - Returns all the game news in JSON format.
* `/api/gta5/scrape` - Purges the current database and scrapes all data from scratch.

## Notes
* Cron job in `server.js` file scrapes the new updates from the target website and updates the database in every Friday.
* Project only supports GTA5 currently. League of Legends, Escape from Tarkov and Valorant will be added in the future.
* A mobile app for frontend is being developed.