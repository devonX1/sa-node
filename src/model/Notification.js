class Notification {
    #branch;
    #municipality;
    #time;
    #street;

    constructor(b, m, t, s){
        this.#branch = b;
        this.#municipality = m;
        this.#time = t;
        this.#street = s;
    }
    get branch() {
        return this.#branch;
    }

    get municipality() {
        return this.#municipality;
    }

    get time() {
        return this.#time;
    }

    get street() {
        return this.#street;
    }
    
    toString() {
        return `Notification { branch: ${this.#branch}, municipality: ${this.#municipality}, time: ${this.#time}, street: ${this.#street} }`;
    }
}

module.exports = Notification;