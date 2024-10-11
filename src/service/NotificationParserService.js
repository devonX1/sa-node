const axios = require('axios');
const cheerio = require('cheerio');

const Notification = require('../model/Notification');

class NotificationParserService {

    daysUrlLMMap = new Map();

    constructor() {
        console.log("NotificationParserService: constructor done");
    }

    async checkForNewContent(url) {
        console.log("Test.testCash() -> NotificationParserService.checkForNewContent(): проверяем поменялась ли страница");
        if (this.daysUrlLMMap.size === 0) {
            console.log("Test.testCash() -> NotificationParserService.checkForNewContent(): prev Map with etags is empty");
            return true;
        }
        const lastModified = await this.getFreshLastModified(url);
        if (!this.daysUrlLMMap.has(url)) {
            console.log("Test.testCash() -> NotificationParserService.checkForNewContent(): Map has not url-key");
            return true;
        }
        if (!(this.daysUrlLMMap.get(url) === lastModified)) {
            console.log("Test.testCash() -> NotificationParserService.checkForNewContent(): prev etag and current etag NOT equals");
            return true;
        }
        console.log("Test.testCash() -> NotificationParserService.checkForNewContent(): возвращаем false");
        return false;
    }

    async parseNotificationPage(url) {
        console.log("Test.testCash() -> NotificationParserService.parseNotificationPage() зашли");
        //Сначала добавляем етаг по конкретному урлу в карту
        const lastModified = await this.getFreshLastModified(url);
        this.daysUrlLMMap.set(url, lastModified);
        console.log("Test.testCash() -> NotificationParserService.parseNotificationPage() Проверяем что LastModified записали в this.daysUrlLMMap" + this.daysUrlLMMap.get(url));
        let notificationMap = new Map();
        try {
            //Чекаем урл и ищем нужные элементы
            const response = await axios.get(url);
            const hparse = await cheerio.load(response.data);
            const tables = hparse('table');
            const extractedText = hparse('table tbody tr:first-child td b').text();
            //console.log("DEBUG DATE: " + extractedText);
            //Берем дату и городс шапки страницы
            const notifDate = await this.extractNotifDate(extractedText);
            const commonCity = await this.extractCityName(extractedText);
            //console.log("DEBUG CITY:" + commonCity);
            //Берем вторую таблицу уже с нотификациями
            const secondTable = tables.eq(1);
            const rows = secondTable.find('tr');
            //Проверяем, если таблица пустая то выходим из метода возвращая массив, не карту
            if (this.isEmptyPage(rows.length)) {
                // THINK ABOUT LOCIG
                 console.log("Empty page and return Array (NOT MAP)")
                 return [];
            }
            //Пропускаем первую строку
            const rowsToProcess = rows.slice(1);
            //Получаем количество стоблцов в таблице с нотификациями
            const columnCount = hparse(rows[0]).find('td').length;
            //Идем по каждой строке таблицы с нотификациями, в конечном возвращая карту с нотификациями
            this.parseTableRows(rowsToProcess, hparse, columnCount, commonCity, notificationMap, notifDate);
            console.log("NotificationParserService.parseNotificationPage(): ");
            console.log(notificationMap);
            return notificationMap;
        } catch (Error) {
            console.error(`Ошибка при парсинге страницы: ${Error.message}`);
        }
    }
    parseTableRows(rowsToProcess, hparse, columnCount, commonCity, notificationMap, notifDate) {
        rowsToProcess.each((index, row) => {
            //console.log(`Row ${index + 1}`);
            let propertyArr = new Array();
            //В рамках строки идем по каждой ее ячейке и пушим ее в массив
            hparse(row).find('td').each((cellIndex, cell) => {
               let cellText = hparse(cell).text().trim();
               //console.log(`Debug cell ${cellIndex + 1}: "${cellText}"`);
               //Если ячейка с городом пустая, добавляем город, который был взят из шапки страницы
               if (cellText === null || cellText === '') {
               // console.log(`Ячейка ${cellIndx + 1} пустая, добавляем commonCity: "${commonCity}"`);
                propertyArr.push(commonCity);
               } else {
               // console.log(`Ячейка ${cellIndex + 1} содержит текст, добавляем: "${cellText}"`);
                propertyArr.push(cellText);
               }
            });
            //console.log("Содержимое массива после парсинга row: ", propertyArr);
            let notification;
            if (columnCount === 3) {
                notification = new Notification(propertyArr[0], propertyArr[0], propertyArr[1], propertyArr[2]);
            } else {
                notification = new Notification(propertyArr[0], propertyArr[1], propertyArr[2], propertyArr[3]);
            }
            //console.log("Debug notificaion object: " + notification.toString());
            this.addRawToBranch(notificationMap, notifDate, notification);
         })
    }

    async getFreshLastModified(url) {
        let currentETag;
        let lastModified;
            try {
                const response = await axios.head(url);
                currentETag = response.headers['etag'];
                lastModified = response.headers['last-modified'];
                const statusCode = response.status; // Получаем статус-код
                console.log(`Test.testCash() -> NotificationParserService.getFreshEtag(): Свежий етаг: ${currentETag}, last-modified: ${lastModified} Статус код: ${statusCode}`);
            } catch (Error) {
                console.error(`Ошибка при парсинге страницы: ${Error.message}`);
            }
        return lastModified;
    }

    isEmptyPage(length) {
       return (length == 1);
    }

    addRawToBranch(map, key, value) {
        //console.log(key);
        //console.log(value.toString());
        let temp = map;
        if (!temp.has(key)) {
            temp.set(key, []);
        }
        //console.log(temp.get(key).toString());
        temp.get(key).push(value);
    }

    extractNotifDate(text) {
            //     /\d{2}\.\d{2}\.\d{4}/
            const datePattern = /(\d{4}-\d{2}-\d{2})|(\d{2}\.\d{2}\.\d{4})/;
            const match = text.match(datePattern);
            if (match) {
                let date = match[0];
                if (date.includes('.')) {
                    const [day, month, year] = date.split('.');
                    date = `${year}-${month}-${day}`;
                }
                return date;
            } else {
                console.log("data not found")
            }
    }
    extractCityName(text) {
            // Регулярное выражение для поиска города, который может состоять из нескольких слов, заканчивающихся на тире
            const cityPattern = /^[А-Яа-я]+(?:\s+[А-Яа-я]+)*\s*-/;
            const match = text.match(cityPattern);
        
            if (match) {
                // Убираем тире из найденного названия и возвращаем в верхнем регистре
                return match[0].replace(/\s*-\s*$/, '').toUpperCase();
            } else {
                console.log("Город не найден");
                return null;
            }
    }
            

}



module.exports = NotificationParserService;