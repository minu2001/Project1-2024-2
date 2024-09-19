let WeatherObject = {
	getWeather: function() {
		$.ajax({
			type: "GET",
			url: 'https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=7d96bc5108f52b80e2d9075a369b9f35',
		}).done(function(response) {
            console.log(response)
            // alert(response.weather.main[0])

            let wdata = response
            let exdata = response.weather[0];re
        
            temp.innerText = wdata.main.temp + "°C";
            min.innerText = wdata.main.temp_min;
            max.innerText = wdata.main.temp_max;
            wind.innerText = wdata.wind.speed;
        
            weather.innerText = exdata.main + "," + exdata.description;
            icon.setAttribute('src', icon_url + exdata.icon + ".png");
		}).fail(function(error) {
			alert("!/js/user.js에서 에러발생: " + error.statusText);
		});
	},
 }

 WeatherObject.getWeather();