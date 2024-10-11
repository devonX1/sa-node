// axios для выполнения HTTP-запросов.
const axios = require('axios');
// cheerio для парсинга HTML-документов.
const cheerio = require('cheerio');
const fs = require('fs');

const ParserPageUrlService = require("./service/ParserPageUrlService");
const NotificationParserService = require("./service/NotificationParserService");
const JsonPrepareService = require('./service/JsonPrepareService');
const ConfigLoader = require('./util/ConfigLoader');
const CronService = require('./service/CronService');
const HttpService = require('./service/HttpService');
const Test = require('./Test');

console.log("Программа запускается...");

const run = async () => {
      const config = new ConfigLoader();
      const cronService = new CronService(config);
      await cronService.runApp();
   //testing();
}

run();

async function testing()  {
    const test = new Test();
   await test.testCash();
}

//console.log("Программа завершилась");