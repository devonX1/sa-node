const axios = require('axios');
const cheerio = require('cheerio');

const ConfigLoader = require('../util/ConfigLoader');

class ParserPageUrlService {

    config;
    hparse = null;
    forUrl;
    mainPageUrlsArray;
    url;

    constructor(config) {
        this.config = config;
        this.forUrl = config.getForUrl();
        this.mainPageUrlsArray = config.getCityUrls();
        console.log("ParserPageUrlService initialized");
    }

    set url(url) {
        this.url = url;
    }
    
    get url() {
        return this.url;
    }

    async parseMainPages() {
        console.log("CronService.runApp.cron.schedule.getDaysUrls -> ParserPageUrlService.parseMainPages(): starting")
        let combindedDaysUrlArray = [];
        for (let i = 0; i <this.mainPageUrlsArray.length; i++) {
            let ulElement = await this.getulElements(this.mainPageUrlsArray[i]);
            let daysUrlArray = await this.getUrls(ulElement)
            combindedDaysUrlArray = combindedDaysUrlArray.concat(daysUrlArray);
        }
        console.log("CronService.runApp.cron.schedule.getDaysUrls -> Итоговая проверка, что получили общий массив с урлами по дням");
        console.log(combindedDaysUrlArray);
        return combindedDaysUrlArray;
    }

    async getulElements(mainUrl) {
        let tempulElement;
        try {
            const response = await axios.get(mainUrl);
            this.hparse = cheerio.load(response.data);
            tempulElement = await this.hparse('ul[data-aos="zoom-out"]');
            //console.log('HTML content of ulElement:', this.ulElement.html());
            if (tempulElement.length === 0) {
                throw new Error('Element not found');
            }
            console.log('Main page parsed successfully');
        } catch (error) {
            console.error(`Ошибка при парсинге страницы: ${error.message}`);
        }
        return tempulElement;
    }

    async getUrls(ulElement) {
        const daysUrlArray = [];
        if (!ulElement) {
            console.error('ulElement is not defined EBLAN?');
            return daysUrlArray;
        }
        ulElement.find('li a').each((index, element) => {
            const href = this.hparse(element).attr('href'); // Получаем атрибут href
            daysUrlArray.push(this.forUrl + href);
        });
        return daysUrlArray;
    }
}

module.exports = ParserPageUrlService;