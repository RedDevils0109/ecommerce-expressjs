const apiKey = '194abb97669ffc43dfe3866b60608585';
const url = 'https://api.openweathermap.org/data/2.5/weather';

window.addEventListener('load', async (event) => {
    try {
        let latitude = "";
        let longitude = "";

      
        const getCurrentPosition = () => {
            return new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => resolve(position),
                        error => reject(error),
                        {
                            enableHighAccuracy: true, 
                            timeout: 10000, 
                            maximumAge: 0 
                        }
                    );
                } else {
                    reject(new Error("Geolocation is not supported by this browser."));
                }
            });
        };

        try {
            const position = await getCurrentPosition();
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log(latitude, longitude)

        } catch (error) {
            console.log(error.message);
            return; 
        }

        const config = {
            params: {
                lat: latitude,
                lon: longitude,
                appid: apiKey
            }
        };

        const res = await axios.get(url, config);
        generateWeather(res.data);

    } catch (e) {
        console.log('Error loading weather:', e);
    }
});

const generateWeather = async (data) => {

    if (!data.name) {
        console.log('No location found');
    } else {
        const city = document.querySelector('#weather-location');
        const temperature = document.querySelector('#weather-temperature');

        city.textContent = data.name;
        const temp = (parseFloat(data.main.temp) - 273.15).toFixed(1);

        temperature.textContent = `${temp} °C`;

        const weatherIcon = data.weather[0].icon;

        generateIcon(weatherIcon);
    }
};

const generateIcon = (iconId) => {
    const url = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
    const figure = document.querySelector('#weather-icon');
    figure.innerHTML = ''; // Clear any previous icon
    const img = document.createElement('img');
    img.src = url;
    img.alt = iconId;
    figure.appendChild(img);
};
