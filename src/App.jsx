import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Day from './components/Day/Day'

import Pin from './assets/pin.svg'
import Rain from './assets/rain.svg'
import Humidity from './assets/humidity.svg'
import Wind from './assets/wind.svg'
import Leaf from './assets/leaf.svg'
import SunTime from './assets/time.svg'
import Chart from './assets/chart.svg'
import FeelsLike from './assets/feelslike.svg'

function App() {
  const [forecastData, setForecastData] = useState({})
  const [dataSuntime, setDataSuntime] = useState({})
  const [cityName, setCityName] = useState(null)
  const [location, setLocation] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const { VITE_API_OPEN_WEATHR_MAP_TOKEN: idOpenWeatherMapToken, VITE_API_WEATER_TOKEN: apiWeatherToken } =
    import.meta.env

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      function (error) {
        console.error('Error Code = ' + error.code + ' - ' + error.message)
      }
    )
  }, [])

  useEffect(() => {
    if (location !== ''){
      getAddressFromLatLong(location.latitude, location.longitude);
    }    
  },[location])
  
  function getAddressFromLatLong(lat, long) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`)
      .then(response => response.json())
      .then(data => setCityName(data.address.city));
  }

  useEffect(() => {
      axios  
        .get(`http://api.weatherapi.com/v1/forecast.json?key=${apiWeatherToken}&q=${cityName}&days=5&aqi=yes&alerts=no`)
        .then(response => {
          setForecastData(response.data)
        })
        .catch(error => {
          console.error('Error fetching weather data:', error)
        })

  }, [cityName, apiWeatherToken])

  useEffect(() => {
    if (location !== ''){
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${idOpenWeatherMapToken}`)
        .then(response => {
          setDataSuntime(response.data)
        })
        .catch(error => {
          console.error('Error fetching weather data:', error)
        })
    }
  }, [location, idOpenWeatherMapToken])

  const searchLocation = city => {
    setShowInput(false)
    axios
      .get(`http://api.weatherapi.com/v1/forecast.json?key=${apiWeatherToken}&q=${city}&days=5&aqi=yes&alerts=no`)
      .then(response => {
        setForecastData(response.data)
        setLocation({
          latitude: response.data.location.lat,
          longitude: response.data.location.lon
        })
      })
  }

  const airQualityDescriptions = {
    1: 'Good',
    2: 'Moderate',
    3: 'Unhealthy for Sensitive Groups',
    4: 'Unhealthy',
    5: 'Very Unhealthy',
    6: 'Hazardous'
  } 

  const airCondition = forecastData?.current?.air_quality['us-epa-index'];

  const weatherIcon = forecastData?.current?.condition?.icon;

  function unixTimestamp(hour){
    const date = new Date(hour * 1000)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`
    return formattedTime
  }

  function sunPosition (sunrise, sunset) {
    const currentTimeUnix = Math.floor(Date.now() / 1000); 
    const totalTime = sunset - sunrise;
    const elapsedTime = currentTimeUnix - sunrise;
    let percentageTimeElapsed = (elapsedTime / totalTime) * 100;
    if (percentageTimeElapsed < 0 || percentageTimeElapsed > 100){
      percentageTimeElapsed = 0;
    }
    return percentageTimeElapsed.toFixed(0);    
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const element = document.querySelector(".sun-chart");
      element.style.setProperty("--pos-x", sunPosition(dataSuntime?.sys.sunrise, dataSuntime?.sys.sunset));
    }, 5000);
    return () => clearInterval(interval);
  }, [dataSuntime]);

  function getWeekDay(epochDate) {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
    const date = new Date(epochDate * 1000);
    const weekDay = weekDays[date.getDay()];
    return weekDay;
  }

  return (
    <div className="app">
      <section className="weather-now">
        <img className="imgWeatherNow" src={weatherIcon} alt="" />
        <div className="location">
          <img src={Pin} alt="Location Pin icon" />
          <div>
            {showInput ? (
              <input
                className="searchLocation"
                type="text"
                onKeyDown={event => event.key === 'Enter' ? searchLocation(event.target.value) : null}
              />
            ) : (
              <strong onClick={() => setShowInput(true)}>
                {cityName ? cityName : 'Insert your location'}
              </strong>
            )}
          </div>
        </div>
        <div className="temperature">
          <div className="number">
            {forecastData.current ? forecastData.current.temp_c.toFixed() : null}
            <div className="tempMinMax">
              {dataSuntime.main ? dataSuntime.main.temp_max.toFixed() : null}°{' '}
              <span>{dataSuntime.main ? dataSuntime.main.temp_min.toFixed() : null}° </span>
            </div>
          </div>
          <div className="scale">°C</div>
        </div>
        <div className="statistics">
          <div className="stats">
            <img src={FeelsLike} alt="Wind icon" />
            <div className="stats-info">
              <p>Feels Like</p>
              <h5>
                {forecastData.current ? forecastData.current.feelslike_c.toFixed() : null} <span>°C</span>
              </h5>
            </div>
          </div>
          <div className="stats">
            <img src={Wind} alt="Wind icon" />
            <div className="stats-info">
              <p>Wind</p>
              <h5>
                {forecastData.current ? forecastData.current.wind_kph.toFixed() : null} <span>km/h</span>
              </h5>
            </div>
          </div>
          <div className="stats">
            <img src={Humidity} alt="Humidity icon" />
            <div className="stats-info">
              <p>Humidity</p>
              <h5>
                {forecastData.current ? forecastData.current.humidity.toFixed() : null} <span>%</span>
              </h5>
            </div>
          </div>
          <div className="stats">
            <img src={Rain} alt="Humidity icon" />
            <div className="stats-info">
              <p>Rain</p>
              <h5>
                {forecastData.current ? forecastData.current.precip_in.toFixed() : null} <span>%</span>
              </h5>
            </div>
          </div>
        </div>
      </section>
      <section className="air-quality">
        <div className="title">
          <img src={Leaf} alt="Leaf icon" />
          <h2>Air Quality</h2>
        </div>
        <div className="air-quality-info">
          <p className="air-quality-info-text">
            {forecastData?.current?.air_quality
              ? airQualityDescriptions[airCondition]
              : null}
          </p>
        </div>
        <div className="air-quality-stats">
          <div className="stats">
            <p>{forecastData.current ? forecastData.current.air_quality.pm2_5.toFixed(1) : null}</p>
            <small>PM2.5</small>
          </div>
          <div className="stats">
            <p>{forecastData.current ? forecastData.current.air_quality.pm10.toFixed(1) : null}</p>
            <small>PM10</small>
          </div>
          <div className="stats">
            <p>{forecastData.current ? forecastData.current.air_quality.so2.toFixed(1) : null}</p>
            <small>SO₂</small>
          </div>
          <div className="stats">
            <p>{forecastData.current ? forecastData.current.air_quality.no2.toFixed(1) : null}</p>
            <small>NO₂</small>
          </div>
          <div className="stats">
            <p>{forecastData.current ? forecastData.current.air_quality.o3.toFixed(1) : null}</p>
            <small>O₃</small>
          </div>
          <div className="stats">
            <p>{forecastData.current ? forecastData.current.air_quality.co.toFixed(1) : null}</p>
            <small>CO</small>
          </div>
        </div>
      </section>
      <section className="sun-time">
        <div className="title">
          <img src={SunTime} alt="SunTime icon" />
          <h2>Sun Time</h2>
        </div>
        <div className="sun-chart-wrapper">
          <div className="sun-chart">
            <div className="chart">
              <img
                src={Chart}
                alt="Image of a chart representing the position of the sun"
              />
            </div>
            <time className="now">{time}</time>
          </div>
        </div>
        <div className="time">
          <time className="sunrise">{unixTimestamp(dataSuntime?.sys?.sunrise)}</time>
          <time className="sunset">{unixTimestamp(dataSuntime?.sys?.sunset)}</time>
        </div>
      </section>
      <section className="week-weather">
        <Day title={'Tomorrow'} icon={forecastData?.forecast?.forecastday[1].day.condition.icon} maxTemp={forecastData?.forecast?.forecastday[1].day.maxtemp_c.toFixed(0)} minTemp={forecastData?.forecast?.forecastday[1].day.mintemp_c.toFixed(0)} />
        <Day title={getWeekDay(forecastData?.forecast?.forecastday[2].date_epoch)} icon={forecastData?.forecast?.forecastday[2].day.condition.icon} maxTemp={forecastData?.forecast?.forecastday[2].day.maxtemp_c.toFixed(0)} minTemp={forecastData?.forecast?.forecastday[2].day.mintemp_c.toFixed(0)} />
      </section>
    </div>
  )
}

export default App
