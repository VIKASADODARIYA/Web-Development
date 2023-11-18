const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    weatherPart = wrapper.querySelector(".weather-part"),
    arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation API");
    }
});

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=b29cf7455360b958e5b997c4a76e1971`;
    fetchData();
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=b29cf7455360b958e5b997c4a76e1971`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api)
        .then((res) => res.json())
        .then((result) => weatherDetails(result))
        .catch(() => {
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
        });
}

function getWindDirectionSymbol(degree) {
    if (degree > 337.5 || degree <= 22.5) {
        return 'N';
    } else if (degree > 22.5 && degree <= 67.5) {
        return 'NE';
    } else if (degree > 67.5 && degree <= 112.5) {
        return 'E';
    } else if (degree > 112.5 && degree <= 157.5) {
        return 'SE';
    } else if (degree > 157.5 && degree <= 202.5) {
        return 'S';
    } else if (degree > 202.5 && degree <= 247.5) {
        return 'SW';
    } else if (degree > 247.5 && degree <= 292.5) {
        return 'W';
    } else if (degree > 292.5 && degree <= 337.5) {
        return 'NW';
    } else {
        return '';
    }
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { temp, feels_like, humidity, pressure, wind, visibility } = info.main;
        const sunriseTimestamp = info.sys.sunrise * 1000; // Convert seconds to milliseconds
        const sunsetTimestamp = info.sys.sunset * 1000; // Convert seconds to milliseconds
        const sunriseTime = new Date(sunriseTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const sunsetTime = new Date(sunsetTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const windDirectionDegree = info.wind.deg;
        const windDirectionSymbolElement = weatherPart.querySelector(".direction .details .deg");
        const windDirectionSymbol = getWindDirectionSymbol(windDirectionDegree);

        // Update weather details in the UI
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        weatherPart.querySelector(".pressure .numb-2").innerText = pressure;
        weatherPart.querySelector(".wind .numb-2").innerText = info.wind.speed;
        weatherPart.querySelector(".visibility .numb-2").innerText = (info.visibility / 1000).toFixed(2);
        weatherPart.querySelector(".sunrise .numb-2").innerText = sunriseTime;
        weatherPart.querySelector(".sunset .numb-2").innerText = sunsetTime;
        weatherPart.querySelector(".direction .numb-2").innerText = windDirectionSymbol;

        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}


arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
