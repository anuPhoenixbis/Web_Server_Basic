import request from 'postman-request';

export const getWeather = (address,callback) => {
  const weatherUrl = `http://api.weatherstack.com/current?access_key=cecd333e6c41e9a37e013055ffa4719f&query=${address}`;

  //performing callbacks here and not directly deciding the output
  //this is done to handle errors and provide a better user experience 
  //in the callback we will pass null for data if there is an error and the error message as the response 
  // at each callback we have to pass the error and data as parameters
  request(weatherUrl, {json: true}, (error,response,body)=>{
    if(error){
      callback('Unable to connect to weather service!',null);
    }else if(response.statusCode != 200){
      callback('Unable to fetch weather data!',null);
    }else if(!body.current){
      callback('Unable to find location!',null);
    }else{
      const data = body;
      callback(null, {
        location: data.location.name,
        temperature: data.current.temperature,
        weatherDescription: data.current.weather_descriptions[0],
        humidity: data.current.humidity,
        windSpeed: data.current.wind_speed,
        observationTime: data.current.observation_time,
        feelsLike: data.current.feelslike
      });
    }
  })
}