const axios = require('axios');
module.exports.getWeatherData = async function(){
    try{
        let response = await axios.get('https://api.openweathermap.org/data/2.5/forecast?q=Chicago&appid=87c54de03e17e8b48a9a0d2b5b80279b&units=metric');
        data = response.data.list;
        let dates = [];
        let temperatues = [];
        for(let i=0;i<10;i++){
            dates.push(data[i].dt_txt.substring(11,16));
            temperatues.push(data[i].main.temp);
        }
        let weatherData={};
        weatherData.dates = dates;
        weatherData.temperatues = temperatues;
        //console.log("weatherData");
        //console.log(weatherData);
        return weatherData;
    }
    catch(err){
        console.log("Could not fetch the data from the weather API");
    }
}