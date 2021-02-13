// import constant from './../constants/constant'


(function () {

  /* constants for the application */
  const constant = {
    GET_WEATHER_URL: 'https://api.openweathermap.org/data/2.5/weather',
    API_KEY: 'e24552fa091342f7f4e86823c3f8ddce',
    CITIES_URL: 'https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json', //As dint findany url for cities so hard coded a new one
    UNITS: "metric",
    CURRENT_LOC_URL: 'https://geolocation-db.com/jsonp'
  }


  $(document).ready(function () {
    /* once document is loaded clear seacrh filter and focus it*/
    $(".search").val("").focus();
    /* get list of cities and aadd datasource to autocomplete*/
    setAutocomplete();
    /* function call for getting current date time to screen*/
    getCurrentDateTime();
    /* check if localstorage is not empty fetch the last selected country*/
    if (localStorage.getItem("city")) {
      getWeatherData(localStorage.getItem("city"), true);
    }
  });

  const setAutocomplete = async () => {
    let data = await fetchData(constant.CITIES_URL);
    if (data) {
      /* filter citites from response*/
      const citiesData = filterItemsByKey(data, 'name', 'country');
      /* pass data to autocomplete function */
      autocomplete(document.getElementById("mySearchInput"), citiesData);
    }
  }

  /* submit handler for city form*/
  $("#cityForm").submit(event => {
    event.preventDefault();
    const cityInput = document.getElementById("mySearchInput");
    if (!cityInput.value) {
      alert("Please provide city.");
    } else if (hasNumber(cityInput.value)) {
      alert("Numbers are not allowed."); //messages should be displayed with better user experience
    } else {
      getWeatherData(cityInput.value);
      getCurrentDateTime()
    }

  });

  const extractCityName = cityLongName => cityLongName.split(",")[0];

  const hasNumber = input => /\d/.test(input);

  /* fucntion for fetching the weather data by city */
  const getWeatherData = async (SEARCH_TERM, isOnloadCall = false) => {
    /* if previous selected city and current city is same return else proceed with api call */
    if (!isOnloadCall && SEARCH_TERM === localStorage.getItem('city')) return;

    localStorage.setItem('city', SEARCH_TERM);
    const SEARCH_URL = `${constant.GET_WEATHER_URL}?q=${extractCityName(SEARCH_TERM)}&units=${constant.UNITS}&appid=${constant.API_KEY}`
    let res = await fetchData(SEARCH_URL);

    if (res) {
      /* if result is success assign values */
      // document.getElementById("weather-condition").innerHTML = res.weather[0].main;
      document.getElementById("weather-condition").innerHTML = (res.weather[0].description).toUpperCase();
      document.getElementById("location_name").innerHTML = res['name'] + ", " + res['sys']['country'];
      let { temp, temp_max, temp_min, humidity } = res.main;
      document.getElementById("location_temp").innerHTML = temp;
      document.getElementById("location_temp_max").innerHTML = temp_max;
      document.getElementById("location_temp_min").innerHTML = temp_min;
      document.getElementById("humidity").innerHTML = humidity;

      if ($("#mySearchInput").val() === "") {
        $("#mySearchInput").val(localStorage.getItem("city"))
      }
    } else {
      /* clear input after displaying error */
      $("#mySearchInput").val("")
    }

  }

  /* fetch utitlity for get call */
  const fetchData = async (url) => {
    try {
      displayLoadingScreen(true);
      let response = await fetch(url);
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
      displayLoadingScreen(false);
    }
  }

  const filterItemsByKey = (itemArr, ...key) => itemArr.map((item) => `${item[key[0]]}, ${item[key[1]]}`);
  // const filterItemsByKey = (itemArr, ...key) => itemArr.map((item) => item[key[0]]);
  // auto complete logic
  const autocomplete = (inp, arr) => {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items text-left");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        // if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        if (arr[i].substr(0, val.length).toUpperCase().includes(val.toUpperCase())) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode === 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode === 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode === 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }

  /* function for fetching the current city of the user */
  document.getElementById("getCurrentLocation").addEventListener("click", function (e) {

    $.ajax({
      url: constant.CURRENT_LOC_URL,
      jsonpCallback: "callback",
      dataType: "jsonp"
    }).done(location => {
      let cityLongName = `${location.city}, ${location.country_name}`
      if (cityLongName) getWeatherData(cityLongName);
      getCurrentDateTime()
      $("#mySearchInput").val(localStorage.getItem("city"))

    }).fail(() => alert("something went wrong while getting the current location"))

  });

  /* function for getting current date time */
  const getCurrentDateTime = () => {
    var d = new Date();
    document.getElementById("currentDateTime").innerHTML = `${d.toLocaleTimeString()}`;
    // setInterval(callback, 1000);
    // callback();

    // function callback() {
    //   var d = new Date();
    //   document.getElementById("currentDateTime").innerHTML = `${d.toLocaleTimeString()}`;
    // }
  }

  /* function for displaying the loading screen */
  const displayLoadingScreen = (displayLoader = false) => {
    const $body = $('body')
    if (displayLoader)
      $body.addClass("loading");
    else
      $body.removeClass("loading");
  }

})()