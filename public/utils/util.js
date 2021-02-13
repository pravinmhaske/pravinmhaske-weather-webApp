class Util {
    /**
     * 
     * @param {*} cityLongName 
     * extract city name from city and country string
     */
    extractCityName(cityLongName) {
        return cityLongName.split(",")[0];
    }

    /**
     * 
     * @param {*} input 
     * check if input value is number of not
     */
    hasNumber(input) {
        return /\d/.test(input);
    }

    /**
     * 
     * @param {*} itemArr 
     * @param  {...any} key 
     */
    filterItemsByKey(itemArr, ...key) {
        // VALUES SHOULD NOT BE ADDED AS KEY[0] KEY[1] --change later
        return itemArr.map((item) => `${item[key[0]]}, ${item[key[1]]}`);
    }

    /**
     * function returns current local time
     */
    getCurrentLocalTime() {
        var today = new Date();
        return `${today.toLocaleTimeString()}`;
    }

}