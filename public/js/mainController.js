(function () {

  let ftObj = appConstObj = constant = autoCompObj = utilObj = uiGenObj = null;

  $(document).ready(function () {
    initiateObjects(); //initiate object of classes
    loadApp();// fire function call once dom is loaded
  });

  const initiateObjects = () => {
    // get fetch utility,app constants and create their object
    ftObj = new Fetch();
    appConstObj = new AppConst();
    constant = appConstObj.getAppConst();
    autoCompObj = new Autocomplete();
    utilObj = new Util();
    uiGenObj = new UIGenerater();
  }

  const loadApp = () => {
    /* once document is loaded clear seacrh filter and focus it*/
    $(".search").val("").focus();
    /* get list of cities and aadd datasource to autocomplete*/
    setAutocomplete();
    /* function call for getting current date time to screen*/
    loadTimeOfDayOnScreen();
    /* check if localstorage is not empty fetch the last selected country*/
    if (localStorage.getItem("city"))
      getWeatherData(localStorage.getItem("city"), true);
    else
      getUsersCurrentLocWeatherData(); //if local storage is empty then load current locations

    uiGenObj.generateFooter();//generate footer html in dom
    // Get the copyright year automatically. 
    document.getElementById("copyright").innerHTML = new Date().getFullYear();
  }

  const setAutocomplete = async () => {
    let data = await ftObj.fetchData(constant.CITIES_URL);
    if (data) {
      /* filter citites from response*/
      const citiesData = utilObj.filterItemsByKey(data, 'name', 'country');
      /* pass data to autocomplete function */
      autoCompObj.autocomplete(document.getElementById("mySearchInput"), citiesData);
    }
  }

  /* submit handler for city form*/
  $("#cityForm").submit(event => {
    event.preventDefault();
    const cityInput = document.getElementById("mySearchInput");
    if (!cityInput.value) {
      alert("Please provide city.");
    } else if (utilObj.hasNumber(cityInput.value)) {
      alert("Numbers are not allowed."); //messages should be displayed with better user experience
    } else {
      getWeatherData(cityInput.value);
      loadTimeOfDayOnScreen()
    }
  });

  /* fucntion for fetching the weather data by city */
  const getWeatherData = async (SEARCH_TERM, isOnloadCall = false) => {
    /* if previous selected city and current city is same return else proceed with api call */
    if (!isOnloadCall && SEARCH_TERM === localStorage.getItem('city')) return;

    localStorage.setItem('city', SEARCH_TERM);
    const SEARCH_URL = `${constant.GET_WEATHER_URL}?q=${utilObj.extractCityName(SEARCH_TERM)}&units=${constant.UNITS}&appid=${constant.API_KEY}`
    let res = await ftObj.fetchData(SEARCH_URL);

    if (res) {
      /* if result is success assign values */
      setWeatherCardValues(res);
      if ($("#mySearchInput").val() === "") setSearchFieldValue(localStorage.getItem("city"))

    } else
      setSearchFieldValue("") /* clear input after displaying error */



  }

  /* function for fetching the current city of the user */
  document.getElementById("getCurrentLocation").addEventListener("click", function (e) {
    getUsersCurrentLocWeatherData();
    // TRIED WITH FETCH BUT GIVES CORS ERROR SO DID WITH JQUERY -change this
  });

  const getUsersCurrentLocWeatherData = async () => {
    $.ajax({
      url: constant.CURRENT_LOC_URL,
      jsonpCallback: "callback",
      dataType: "jsonp"
    }).done(location => {
      let cityLongName = `${location.city}, ${location.country_name}`
      if (cityLongName) getWeatherData(cityLongName);
      loadTimeOfDayOnScreen()
      setSearchFieldValue(localStorage.getItem("city"))

    }).fail(() => alert("something went wrong while getting the current location"))
  }

  /* function for getting current date time */
  const loadTimeOfDayOnScreen = () => {
    document.getElementById("currentDateTime").innerHTML = utilObj.getCurrentLocalTime();;
  }
  /* set value of search field input box*/
  const setSearchFieldValue = value => $("#mySearchInput").val(value);

  /**
   * 
   * @param {*} res 
   * setting the values for weathers card
   */
  const setWeatherCardValues = res => {
    let { temp, temp_max, temp_min, humidity } = res.main;
    const { description } = res.weather[0];
    const { name } = res;

    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
    document.getElementById("weather-condition").innerHTML = description;
    document.getElementById("location_name").innerHTML = name + ", " + res['sys']['country'];
    document.getElementById("location_temp").innerHTML = temp;
    document.getElementById("location_temp_max").innerHTML = temp_max;
    document.getElementById("location_temp_min").innerHTML = temp_min;
    document.getElementById("humidity").innerHTML = humidity;
  }

})()