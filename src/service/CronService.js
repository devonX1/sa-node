const cron = require('node-cron');

const ParserPageUrlService = require("./ParserPageUrlService");
const NotificationParserService = require("./NotificationParserService");
const JsonPrepareService = require("./JsonPrepareService");
const HttpService = require('./HttpService');

class CronService {
    mainPageUrlsArray;
    config;
    httpService;
    jsonPrepareService;

    constructor(config) {
        this.config = config;
        this.mainPageUrlsArray = config.getCityUrls();
        this.httpService = new HttpService(config);
        this.jsonPrepareService = new JsonPrepareService();

    }

    async runApp() {
        //Инициализирую класс выше всего, чтобы передавать его поссылке, тем самым не перезаписываю карту
        console.log("CronService.runApp(): starting")
        const notificationParserService = new NotificationParserService();
        let combindedDaysUrlArray;
        await cron.schedule('0 */5 * * *', async () => {
            console.log("CronService.runApp.cron.schedule(): cron process starting");
            combindedDaysUrlArray = await this.getDaysUrls();
            await this.getAndSendFreshNotification(combindedDaysUrlArray, notificationParserService);
         })
    }
    //Получаем урлы-дни по Б и НС
    async getDaysUrls()  {
        console.log("CronService.runApp.cron.schedule.getDaysUrls(): starting")
        const parserPageUrlService = new ParserPageUrlService(this.config);
        const combindedDaysUrlArray = await parserPageUrlService.parseMainPages();
        return combindedDaysUrlArray;    
    }

    async getAndSendFreshNotification(combindedDaysUrlArray, notificationParserService) {
        //Идем по массиву с урлами-днями и по каждому запускаем процесс
        console.log("CronService.runApp.cron.schedule.getAndSendFreshNotification(): starting");
        let notificationMap;
        for (let dayUrl of combindedDaysUrlArray) {
            console.log("Test.testCash(): урл -> " + dayUrl);
            let cash = await notificationParserService.checkForNewContent(dayUrl);
            if (!cash) {
                console.log("test_checkForNewContent: Пропускаем страницу с уведомлениями, там ничего не поменялось");
                continue;
            }
            notificationMap = await notificationParserService.parseNotificationPage(dayUrl);
            //Страница могла измениться и быть пустой, проверяем, если так пропускаем дальнешуюю ее обработку
            if (!(notificationMap instanceof Map)) {
                console.log("test_checkForNewContent: Пропустили карту, не было уведомлений")
                continue;
            }
            const jsonStringNotification = await this.jsonPrepareService.createJsonsFromMaps(notificationMap);
            console.log(jsonStringNotification);
            this.send(jsonStringNotification);
        }
    }

    send(data) {
        this.httpService.send(data);
    }
}

module.exports = CronService;