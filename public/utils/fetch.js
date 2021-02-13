class Fetch {

    /**
     * 
     * @param {*} url 
     * fetch utitlity for get call 
     */
    async fetchData(url, options = {}) {
        try {
            this.displayLoadingScreen(true);
            let response = await fetch(url, options);
            if (!response.ok) { /* throw response if not ok */
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const json = await response.json();
                return json;
            }

        } catch (e) { /* print error message */
            alert('There has been a problem with your fetch operation: ' + e.message);
        }
        finally {
            this.displayLoadingScreen(false);
        }
    }

    /**
     * 
     * @param {*} displayLoader 
     * function for displaying the loading screen 
     */
    displayLoadingScreen(displayLoader = false) {
        const $body = $('body')
        if (displayLoader)
            $body.addClass("loading");
        else
            $body.removeClass("loading");
    }
}