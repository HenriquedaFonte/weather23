import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

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
import Day from './components/Day/Day'

function App() {
  const [data, setData] = useState({})
  const [airQualityData, setAirQualityData] = useState({})
  const [location, setLocation] = useState('')
  const [locationName, setLocationName] = useState('')
  const [showInput, setShowInput] = useState(false)
  const idToken = import.meta.env.VITE_API_TOKEN
  const idTokenAirQuality = import.meta.env.VITE_AIR_QUALITY_TOKEN

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLocation({
          latitude: position.coords.latitude.toFixed(2),
          longitude: position.coords.longitude.toFixed(2)
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

      const lati = parseInt(location.latitude)
      const long = parseInt(location.longitude)
      const urlAirQuality = `https://api.waqi.info/feed/geo:${lati};${long}/?token=${idTokenAirQuality}`
      axios
        .get(urlAirQuality)
        .then(response => {
          setAirQualityData(response.data)
        })
        .catch(error => {
          console.error('Error fetching weather data:', error)
        })
    }
  }, [location, idToken, idTokenAirQuality])

  const urlCity = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&units=metric&appid=${idToken}`

  const searchLocation = event => {
    if (event.key === 'Enter') {
      setShowInput(false)
      axios.get(urlCity).then(response => {
        setData(response.data)
        console.log(response.data)
      })
    }
  }

  function mainImg() {
    if (data.weather) {
      if (data.weather[0].main === 'Rain') {
        return BigRain
      } else if (data.weather[0].main === 'Clouds') {
        return Cloud
      } else if (data.weather[0].main === 'Sun') {
        return Sun
      } else if (data.weather[0].main === 'Snow') {
        return Snow
      }
    }
  }

  console.log(location)
  console.log(data)
  console.log(airQualityData)

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
                value={locationName}
                onKeyUp={event => setLocation(event.target.value)}
                onKeyDown={searchLocation}
              />
            ) : (
              <strong onClick={() => setShowInput(true)}>
                {data ? data.name : 'Teste'}
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
                {data.main ? data.main.feels_like.toFixed() : null}{' '}
                <span>°C</span>
              </h5>
            </div>
          </div>
          <div className="stats">
            <img src={Wind} alt="Wind icon" />
            <div className="stats-info">
              <p>Wind</p>
              <h5>
                {data.wind ? data.wind.speed.toFixed() : null} <span>km/h</span>
              </h5>
            </div>
          </div>
          <div className="stats">
            <img src={Humidity} alt="Humidity icon" />
            <div className="stats-info">
              <p>Humidity</p>
              <h5>
                {data.main ? data.main.humidity : null} <span>%</span>
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
              ? airQualityData.data.aqi < 50
                ? 'Good'
                : airQualityData.data.aqi < 100
                ? 'Moderate'
                : airQualityData.data.aqi < 100
                ? 'Unhealthy for Sensitive Groups'
                : 'Unhealthy'
              : null}
          </p>
          <p className="number">
            {airQualityData.data ? airQualityData.data.aqi : null}
          </p>
        </div>
        <div className="air-quality-stats">
          <div className="stats">
            <p>
              {airQualityData.data ? airQualityData.data.iaqi.pm25.v : null}
            </p>
            <small>PM2.5</small>
          </div>
          <div className="stats">
            <p>
              {airQualityData.data ? airQualityData.data.iaqi.pm10.v : null}
            </p>
            <small>PM10</small>
          </div>
          <div className="stats">
            <p>{airQualityData.data ? airQualityData.data.iaqi.so2.v : null}</p>
            <small>SO₂</small>
          </div>
          <div className="stats">
            <p>{airQualityData.data ? airQualityData.data.iaqi.t.v : null}</p>
            <small>NO₂</small>
          </div>
          <div className="stats">
            <p>{airQualityData.data ? airQualityData.data.iaqi.o3.v : null}</p>
            <small>O₃</small>
          </div>
          <div className="stats">
            <p>{airQualityData.data ? airQualityData.data.iaqi.w.v : null}</p>
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
            <time className="now">17:48</time>
          </div>
        </div>
        <div className="time">
          <time className="sunrise">06:52</time>
          <time className="sunset">18:52</time>
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
