import './App.css'
import Pin from './assets/pin.svg'
import Rain from './assets/rain.svg'
import Humidity from './assets/humidity.svg'
import Wind from './assets/wind.svg'
import Leaf from './assets/leaf.svg'


function App() {
  return (
    <div className="app">
      <div className="container">
        <section className="weather-now">
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
        <section className="air-quality">
          <div className="title">
            <img src={Leaf} alt="Leaf icon" />
            <h2>Air Quality</h2> 
          </div>
          <div className="air-quality-info">
            <p className='good'>Good</p>
            <p className='number'>21</p>
          </div>
          <div className="air-quality-stats">
            <div className="stats">
              <p>12.9</p>
              <small>PM2.5</small>
            </div>
            <div className="stats">
              <p>12.9</p>
              <small>PM10</small>
            </div>
            <div className="stats">
              <p>2.1</p>
              <small>SO₂</small>
            </div>
            <div className="stats">
              <p>1.4</p>
              <small>NO₂</small>
            </div>
            <div className="stats">
              <p>21.2</p>
              <small>O₃</small>
            </div>
            <div className="stats">
              <p>0.7</p>
              <small>CO</small>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
