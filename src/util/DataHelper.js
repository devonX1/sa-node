
class DataHelper {

    constructor() {
        console.log("dataHelper created");
    }

    daysUrlMapsArrayToFlatMap(daysUrlMapsArray) {
        const daysUrlEtagMap = new Map();
         for (let i = 0; i < daysUrlMapsArray.length; i++) {
             daysUrlMapsArray[i].forEach((etag, url) => {
                 daysUrlEtagMap.set(url, etag);
             });
         }
         return daysUrlEtagMap;
    }
    mapsArrayToFlatArray(daysUrlMapsArray) {
        //console.log(daysUrlMapsArray);
        let daysUrlArray = [];
        for (let i = 0; i < daysUrlMapsArray.length; i++) {
            Array.from(daysUrlMapsArray[i].values()).forEach(element => {
                daysUrlArray.push(element);
            });
        }
        return daysUrlArray;
    }
    // async testMap() {
    //     for (let i = 0; i < this.#arrMapsForJson.length; i++) {
    //         console.log("Вошли в цикл по массив, идем по картам" + i);
    //         let singleMap = this.#arrMapsForJson[i];
    //         singleMap.forEach((notificationArray, b) => {
    //             console.log("Идем внутри карты, значение это массив объектов");
    //             for (let k = 0; k < notificationArray.length; k++) {
    //                 console.log("А теперь уже внутри массивов объектов нотификаций");
    //                 console.log(notificationArray[k] instanceof Notification);
    //                 console.log(notificationArray[k].toString());
    //             }
    //         });
    //     }
    // } 
}

module.exports = DataHelper;