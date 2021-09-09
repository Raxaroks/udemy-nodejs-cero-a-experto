const axios = require("axios").default;
const fs = require("fs");


class Searches {

    dbpath = "./db/database.json"
    historial = [];

    constructor() {
        this.readDB();
    }

    get paramsMapbox() {
        return {
            "access_token": process.env.MAPBOX_KEY,
            "limit": 5,
            "language": "es"
        }
    }

    get paramsOpenweather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: "metric",
            lang: "es"
        }
    }

    get upperHistory() {
        return this.historial.map( place => {
            let words = place.split(" ");
            words = words.map( w => w[0].toUpperCase() + w.substring(1) );

            return words.join(" ");
        } );
    }

    async city( place = "" ) {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map( plce => ({
                id: plce.id,
                nombre: plce.place_name,
                lng: plce.center[0],
                lat: plce.center[1]
            }) );
        }
        
        catch (error) {
            
        }
    }

    async weatherPlace( lat, lon ) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    ...this.paramsOpenweather,
                    lat,
                    lon
                }
            });

            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        }
        
        catch (error) {
            console.log(error);
        }
    } 

    addHistory( place = "" ) {
        // prevenir duplicados
        if ( this.historial.includes( place.toLowerCase() ) ) {
            return;
        }
        this.historial = this.historial.splice(0, 5);
        this.historial.unshift( place.toLowerCase() );

        // guardamos en la database
        this.saveDB();
    }

    saveDB() {
        const payload = {
            history: this.historial
        };
        fs.writeFileSync( this.dbpath, JSON.stringify( payload ) )
    }

    readDB() {
        if ( !fs.existsSync(this.dbpath) ) return;

        const info = fs.readFileSync( this.dbpath, { encoding: "utf-8" } );
        const data = JSON.parse(info);

        this.historial = data.history;
    }

}

module.exports = Searches;