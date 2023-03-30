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
import Sun from './assets/sun.svg'
import Cloud from './assets/cloud.svg'
import RainBig from './assets/rainBig.svg'
import Thunder from './assets/thunder.svg'
import PartlyCloudy from './assets/partlyCloudy.svg'

function App() {
  const [data, setData] = useState({})
  const [dataSuntime, setDataSuntime] = useState({})
  const [cityName, setCityName] = useState(null)
  const [location, setLocation] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const { VITE_API_TOKEN: idToken, VITE_AIR_QUALITY_TOKEN: idTokenAirQuality, VITE_API_WEATER_TOKEN: apiIdToken } =
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
      const url = `http://api.weatherapi.com/v1/current.json?key=${apiIdToken}&q=${cityName}&aqi=yes`
      axios
        .get(url)
        .then(response => {
          setData(response.data)
        })
        .catch(error => {
          console.error('Error fetching weather data:', error)
        })
  }, [cityName, apiIdToken])

  useEffect(() => {
    if (location !== ''){
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${idToken}`
      axios
        .get(url)
        .then(response => {
          setDataSuntime(response.data)
        })
        .catch(error => {
          console.error('Error fetching weather data:', error)
        })
    }
  }, [location, idToken])

  const searchLocation = city => {
    setShowInput(false)
    axios
      .get(`http://api.weatherapi.com/v1/current.json?key=${apiIdToken}&q=${city}&aqi=yes`)
      .then(response => {
        setData(response.data)
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

  const airCondition = data?.current?.air_quality['us-epa-index'];

  const weatherIcon = data?.current?.condition?.icon

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

  console.log(data);
  console.log(dataSuntime);

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
            {data.current ? data.current.temp_c.toFixed() : null}
            <div className="tempMinMax">
              {dataSuntime.main ? dataSuntime.main.temp_max.toFixed() : null}°{' '}
              <span>{dataSuntime.main ? dataSuntime.main.temp_min.toFixed() : null}° </span>
            </div>
          </div>
          <div className="scale">°C</div>
        </div>
        <div className="statistics">
          <div className="stats">
            <img src={Wind} alt="Wind icon" />
            <div className="stats-info">
              <p>Feels Like</p>
              <h5>
                {data.current ? data.current.feelslike_c.toFixed() : null} <span>°C</span>
              </h5>
            </div>
          </div>
          <div className="stats">
            <img src={Wind} alt="Wind icon" />
            <div className="stats-info">
              <p>Wind</p>
              <h5>
                {data.current ? data.current.wind_kph.toFixed() : null} <span>km/h</span>
              </h5>
            </div>
          </div>
          <div className="stats">
            <img src={Humidity} alt="Humidity icon" />
            <div className="stats-info">
              <p>Humidity</p>
              <h5>
                {data.current ? data.current.humidity.toFixed() : null} <span>%</span>
              </h5>
            </div>
          </div>
          <div className="stats">
            <img src={Rain} alt="Humidity icon" />
            <div className="stats-info">
              <p>Rain</p>
              <h5>
                {data.current ? data.current.precip_in.toFixed() : null} <span>%</span>
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
            {data?.current?.air_quality
              ? airQualityDescriptions[airCondition]
              : null}
          </p>
        </div>
        <div className="air-quality-stats">
          <div className="stats">
            <p>{data.current ? data.current.air_quality.pm2_5.toFixed(1) : null}</p>
            <small>PM2.5</small>
          </div>
          <div className="stats">
            <p>{data.current ? data.current.air_quality.pm10.toFixed(1) : null}</p>
            <small>PM10</small>
          </div>
          <div className="stats">
            <p>{data.current ? data.current.air_quality.so2.toFixed(1) : null}</p>
            <small>SO₂</small>
          </div>
          <div className="stats">
            <p>{data.current ? data.current.air_quality.no2.toFixed(1) : null}</p>
            <small>NO₂</small>
          </div>
          <div className="stats">
            <p>{data.current ? data.current.air_quality.o3.toFixed(1) : null}</p>
            <small>O₃</small>
          </div>
          <div className="stats">
            <p>{data.current ? data.current.air_quality.co.toFixed(1) : null}</p>
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
        <Day title={'Tomorrow'} icon={Cloud} maxTemp={20} minTemp={16} />
        <Day title={'Friday'} icon={Sun} maxTemp={29} minTemp={23} />
        <Day title={'Saturday'} icon={RainBig} maxTemp={19} minTemp={11} />
        <Day title={'Sunday'} icon={Thunder} maxTemp={21} minTemp={16} />
        <Day title={'Monday'} icon={PartlyCloudy} maxTemp={20} minTemp={16} />
      </section>
    </div>
  )
}

export default App
