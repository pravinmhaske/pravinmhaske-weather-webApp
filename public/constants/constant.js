


class AppConst {

    /* constants for the application */
    getAppConst() {
        const constant = {
            GET_WEATHER_URL: 'https://api.openweathermap.org/data/2.5/weather',
            API_KEY: 'e24552fa091342f7f4e86823c3f8ddce',
            CITIES_URL: 'https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json', //As dint findany url for cities so hard coded a new one
            UNITS: "metric",
            CURRENT_LOC_URL: 'https://geolocation-db.com/jsonp'
        }
        return constant;
    }

}