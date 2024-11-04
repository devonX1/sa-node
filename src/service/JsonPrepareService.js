const axios = require('axios');
const cheerio = require('cheerio');
const { parse, format, isMatch } = require('date-fns');

class JsonPrepareService {

    async createJsonsFromMaps(notificationMap) {
        let jsonString;
            notificationMap.forEach((notificationArray, b) => {
                const dateString = this.normalizeDate(b);
                console.log("Проверяем, что метод вернул строку с датой: " + dateString);
                //console.log("Идем внутри карты")
                //console.log(notificationArray);
                const objForJson = {
                    notificationDate: dateString,
                    notifications: notificationArray.map(notification => ({
                        branch: notification.branch,
                        town: notification.municipality,
                        time: notification.time,
                        street: notification.street
                    }))
                };
                jsonString = JSON.stringify(objForJson, null, 2);
            });
        return jsonString;
    }

    normalizeDate(dateString) {
        // Проверяем, если дата уже в нужном формате 'dd.MM.yyyy'
        if (isMatch(dateString, 'dd.MM.yyyy')) {
            return dateString;
        }
        if (isMatch(dateString, 'yyyy-MM-dd')) {
            const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
            return format(parsedDate, 'dd.MM.yyyy');
        }
        throw new Error(`Неподдерживаемый формат даты: ${dateString}`);
    }
}

module.exports = JsonPrepareService;