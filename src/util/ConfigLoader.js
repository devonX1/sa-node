const fs = require('fs');

class ConfigLoader {

    config;

    constructor() {
        this.config = JSON.parse(fs.readFileSync('./configuration/config.json', 'utf-8'));
        console.log("ConfigLoader initialized")
    }

    getBgd() {
        const bgt = this.config.cityUrl['Bgd'];
        return bgt;
    }
    getNs() {
        const ns = this.config.cityUrl['Ns'];
        return ns;
    }
    getKv() {
        const kv = this.config.cityUrl['Kv'];
        return kv;
    }
    getKg() {
        const kg = this.config.cityUrl['Kg'];
        return kg;
    }
    getNi() {
        const ni = this.config.cityUrl['Ni'];
        return ni;
    }
    getCityUrls() {
        const urls = Object.values(this.config.cityUrl);
        return urls;
    }
    getEndpointUrl() {
        const restApiUrl = this.config.restApi;
        return restApiUrl;
    }
    getForUrl() {
        const forUrl = this.config.forUrl;
        return forUrl;
    }
    getAuthHeader() {
        const authHeader = this.config.authHeader;
        return authHeader;
    }


}

module.exports = ConfigLoader;