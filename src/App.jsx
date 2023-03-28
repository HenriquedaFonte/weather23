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
import Snow from './assets/snow.png'
import Thunder from './assets/thunder.svg'
import PartlyCloudy from './assets/partlyCloudy.svg'

function App() {
  const [data, setData] = useState({})
  const [airQualityData, setAirQualityData] = useState({})
  const [location, setLocation] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const { VITE_API_TOKEN: idToken, VITE_AIR_QUALITY_TOKEN: idTokenAirQuality } =
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
    if (location) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${idToken}`
      axios
        .get(url)
        .then(response => {
          setData(response.data)
          setLocationName(response.data.name)
        })
        .catch(error => {
          console.error('Error fetching weather data:', error)
        })
    }
  }, [location, idToken])

  useEffect(() => {
    if (location) {
      const lati = parseInt(location.latitude)
      const long = parseInt(location.longitude)
      axios
        .get(`https://api.waqi.info/feed/geo:${lati};${long}/?token=${idTokenAirQuality}`)
        .then(response => {
          setAirQualityData(response.data)
        })
        .catch(error => {
          console.error('Error fetching air quality data:', error)
        })
    }
  }, [location, idTokenAirQuality])


  const searchLocation = city => {
    setShowInput(false)
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${idToken}`)
      .then(response => {
      setData(response.data)
    })
    axios
      .get(`https://api.waqi.info/feed/${city}/?token=${idTokenAirQuality}`)
      .then(response => {
        setAirQualityData(response.data)
      })
      .catch(error => {
        console.error('Error fetching air quality data:', error)
      })
  }

  function mainImg() {
    switch (data?.weather?.[0]?.main) {
      case 'Rain':
        return RainBig
      case 'Clouds':
        return Cloud
      case 'Clear':
        return Sun
      case 'Snow':
        return Snow
      default:
        return null
    }
  }

  const airQualityDescriptions = {
    1: 'Good',
    2: 'Moderate',
    3: 'Unhealthy for Sensitive Groups',
    4: 'Unhealthy'
  }

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

  console.log(sunPosition(data?.sys?.sunrise, data?.sys?.sunset));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const element = document.querySelector(".sun-chart");
      element.style.setProperty("--pos-x", sunPosition(data?.sys.sunrise, data?.sys.sunset));
    }, 5000);
    return () => clearInterval(interval);
  }, [data]);


  console.log(airQualityData)
  console.log(location);
  console.log(data);

  return (
    <div className="app">
      <section className="weather-now">
        <img className="imgWeatherNow" src={mainImg()} alt="" />
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
                {data ? data?.name : 'Insert your location'}
              </strong>
            )}
          </div>
        </div>
        <div className="temperature">
          <div className="number">
            {data.main ? data.main.temp.toFixed() : null}
            <div className="tempMinMax">
              {data.main ? data.main.temp_max.toFixed() : null}°{' '}
              <span>{data.main ? data.main.temp_min.toFixed() : null}° </span>
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
                {data?.main?.feels_like.toFixed()} <span>°C</span>
              </h5>
            </div>
          </div>
          <div className="stats">
            <img src={Wind} alt="Wind icon" />
            <div className="stats-info">
              <p>Wind</p>
              <h5>
                {data?.wind?.speed.toFixed()} <span>km/h</span>
              </h5>
            </div>
          </div>
          <div className="stats">
            <img src={Humidity} alt="Humidity icon" />
            <div className="stats-info">
              <p>Humidity</p>
              <h5>
                {data?.main?.humidity} <span>%</span>
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
          <p className="good">
            {airQualityData.data
              ? airQualityDescriptions[Math.ceil(airQualityData.data.aqi / 50)]
              : null}
          </p>
          <p className="number">{airQualityData?.data?.aqi}</p>
        </div>
        <div className="air-quality-stats">
          <div className="stats">
            <p>{airQualityData?.data?.iaqi?.pm25?.v}</p>
            <small>PM2.5</small>
          </div>
          <div className="stats">
            <p>{airQualityData?.data?.iaqi?.pm10?.v}</p>
            <small>PM10</small>
          </div>
          <div className="stats">
            <p>{airQualityData?.data?.iaqi?.so2?.v}</p>
            <small>SO₂</small>
          </div>
          <div className="stats">
            <p>{airQualityData?.data?.iaqi?.t?.v}</p>
            <small>NO₂</small>
          </div>
          <div className="stats">
            <p>{airQualityData?.data?.iaqi?.o3?.v}</p>
            <small>O₃</small>
          </div>
          <div className="stats">
            <p>{airQualityData?.data?.iaqi?.w?.v}</p>
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
          <time className="sunrise">{unixTimestamp(data?.sys?.sunrise)}</time>
          <time className="sunset">{unixTimestamp(data?.sys?.sunset)}</time>
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
