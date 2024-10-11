const axios = require('axios');
const cheerio = require('cheerio');

const ConfigLoader = require('../util/ConfigLoader');

class HttpService {
    restEndpoint
    httpClient;
    XAuth;

    constructor(config) {
        this.restEndpoint = config.getEndpointUrl();
        this.XAuth = config.getAuthHeader();
        this.httpClient = axios.create({
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': this.XAuth
            }
        });
        console.log("HttpService created")
    }

    async send(data) {
        console.log("CronService.runApp.cron.schedule.send.httpService.send(): restEndpoint: " + this.restEndpoint);
        try {
            const response = await this.httpClient.post(this.restEndpoint, data);
            return response;
        } catch (error) {
            console.log("Ошибка при отправке запроса", error.message);
            throw error;
        }
    }

}

module.exports = HttpService;