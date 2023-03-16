import './App.css'
import Pin from './assets/pin.svg'
import Rain from './assets/rain.svg'
import Humidity from './assets/humidity.svg'
import Wind from './assets/wind.svg'


function App() {
  return (
    <div className="app">
      <div className="container">
        <section className="info-weather-now">
          <div className="location">
            <img src={Pin} alt="Location Pin icon" />
            <strong>Recife, PE</strong>
          </div>
          <div className="temperature">
            <div className="number">
              20
              <div className="tempminmax">
                25° <span>15°</span>
              </div>
            </div>
            <div className="scale">°C</div>
          </div>
          <div className="statistics">
            <div className="stats">
              <img src={Wind} alt="Wind icon" />
              <div className="stats-info">
                <p>Wind</p>
                <h5>17 <span>km/h</span></h5>
              </div>
            </div>
            <div className="stats">
              <img src={Humidity} alt="Humidity icon" />
              <div className="stats-info">
                <p>Humidity</p>
                <h5>31 <span>%</span></h5>
              </div>
            </div>
            <div className="stats">
              <img src={Rain} alt="Rain icon" />
              <div className="stats-info">
                <p>Rain</p>
                <h5>10 <span>%</span></h5>
              </div>
            </div>
           </div>
        </section>
      </div>
    </div>
  )
}

export default App
