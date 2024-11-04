const fs = require('fs');
const env = process.env.NODE_ENV;

class ConfigLoader {

    config;

    constructor() {
        if (env === 'docker') {
            this.config = JSON.parse(fs.readFileSync('./configuration/config-docker.json', 'utf-8'));
        } else if (env == 'heroku') {
            this.config = JSON.parse(fs.readFileSync('./configuration/config-heroku.json', 'utf-8'));
        } else {
            this.config = JSON.parse(fs.readFileSync('./configuration/config.json', 'utf-8'));
        }
        console.log("ConfigLoader initialized");
        console.log("check node_env =" + env);
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