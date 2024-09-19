let temp = document.querySelector('#temp');
let min = document.querySelector('#min');
let max = document.querySelector('#max');
let wind = document.querySelector('#wind');
let weather = document.querySelector('#weather');
let icon = document.querySelector("#icon");
let icon_url = "https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/";
//https://api.openweathermap.org/data/2.5/find?q=Seoul&units=metric&appid=7d96bc5108f52b80e2d9075a369b9f35'
function get_weather() {
    
    city = document.getElementById('city')
    cityname = city.value
    tformat = document.getElementById('tformat').value
    
    console.log(cityname)

    weather_url = "https://api.openweathermap.org/data/2.5/find?"
    appid = '&appid=7d96bc5108f52b80e2d9075a369b9f35'
    final_url = weather_url + "q=" + cityname + "&units=" + tformat + appid 


    axios.get(final_url)
        .then(function (response) {
            console.log(response.data);
            let wdata = response.data.list[0];
            let exdata = response.data.list[0].weather[0];

            temp.innerText = wdata.main.temp + "";
            min.innerText = wdata.main.temp_min;
            max.innerText = wdata.main.temp_max;
            wind.innerText = wdata.wind.speed;

            weather.innerText = exdata.main + "," + exdata.description;
            icon.setAttribute('src', icon_url + exdata.icon + ".png");
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () { });

}
get_weather()