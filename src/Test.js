const cron = require('node-cron');

const NotificationParserService = require('./service/NotificationParserService');
const TestCron = require("./TestCron");
const JsonPrepareService = require("./service/JsonPrepareService");
const HttpService = require('./service/HttpService');

class Test {
    //test urls
    combindedDaysUrlArray = [];

    async testCash() {
        const notificationParserService = new NotificationParserService();
        const jsonPrepareService = new JsonPrepareService();
        for (let dayUrl of this.combindedDaysUrlArray) {
            console.log("Test.testCash(): урл -> " + dayUrl);
            let cash = await notificationParserService.checkForNewContent(dayUrl);
            if (!cash) {
                console.log("test_checkForNewContent: Пропускаем страницу с уведомлениями, там ничего не поменялось");
                continue;
            }
            const notificationMap = await notificationParserService.parseNotificationPage(dayUrl);
            //Страница могла измениться и быть пустой, проверяем, если так пропускаем дальнешуюю ее обработку
            if (!(notificationMap instanceof Map)) {
                console.log("test_checkForNewContent: Пропустили карту, не было уведомлений")
                continue;
            }
            let forSout = jsonPrepareService.createJsonsFromMaps(notificationMap);
            console.log(forSout);
        }
    }
    async testCron() {
        await cron.schedule('* * * * *',  async () => {
            console.log("CronService.runApp.cron.schedule(): starting");
            const t = new TestCron();
            await t.forCron();
            
        })
    }
    async testCreateJsonsFromMaps() {

    }
}

module.exports = Test;