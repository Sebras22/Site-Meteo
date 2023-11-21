import { useState } from 'react'
import './App.css'
import sunImage from './assets/Sun.png'
import rainImage from './assets/rain.png'
import sunriseImage from './assets/sunset.png'
import partiellementnuage from './assets/partiellementnuage.png'
import Nuage from './components/Nuage.jsx'

function App() {
  const getData = async (latitude, longitude) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,&daily=sunrise,sunset,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max&start_date=${getDate()}&end_date=${getDate(
        true
      )}&timezone=Europe%2FBerlin`
    )
    const res = await response.json()
    setData(res)
  }

  const getDataHours = async (latitude, longitude) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=rain&timezone=Europe%2FBerlin`
    )
    const res = await response.json()
    setDataHours(res)
  }

  const getPosition = async (e) => {
    e.preventDefault()
    if (!ville) return
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${ville}`
    )
    const pos = await geo.json()
    if (pos?.results?.[0]) {
      const { latitude, longitude, name, country_code } = pos?.results?.[0]
      getData(latitude, longitude)
      getDataHours(latitude, longitude)
      setError(false)
      setCity(name)
      setPays(country_code)
      setLat(latitude)
      setLong(longitude)
    } else {
      setError(true)
      setCity('')
      setPays('')
      setLat('')
      setLong('')
    }
  }

  // Table de Correspondance

  const semaine = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ]
  const mois = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décemnbre',
  ]
  const [datahours, setDataHours] = useState({})

  const [data, setData] = useState({})

  const [error, setError] = useState(false)

  const [ville, setVille] = useState('')

  const [city, setCity] = useState('')

  const [pays, setPays] = useState('')

  const [lat, setLat] = useState('')

  const [long, setLong] = useState('')

  const getDay = (timestamp) => {
    let today = new Date(timestamp)
    let time = {
      y: today.getFullYear(),
      m: today.getMonth(),
      d: today.getDate(),
      h: today.getHours(),
      t: semaine[today.getDay()],
      n: mois[today.getMonth()],
    }
    return `${time.t}`
  }

  const getNumber = (timestamp) => {
    let today = new Date(timestamp)
    let time = {
      y: today.getFullYear(),
      m: today.getMonth(),
      d: today.getDate(),
      h: today.getHours(),
      t: semaine[today.getDay()],
      n: mois[today.getMonth()],
    }
    return `${time.d} `
  }

  const getMonth = (timestamp) => {
    let today = new Date(timestamp)
    let time = {
      y: today.getFullYear(),
      m: today.getMonth(),
      d: today.getDate(),
      h: today.getHours(),
      t: semaine[today.getDay()],
      n: mois[today.getMonth()],
    }
    return `${time.n}`
  }

  const getHours = (timestamp) => {
    const levesoleil = new Date(timestamp)
    const heures = levesoleil.getHours()
    const min = levesoleil.getMinutes()

    return `${heures}h${min < 10 ? '0' : ''}${min}`
  }

  const getDate = (isAdd = false) => {
    let today = new Date()
    if (isAdd) {
      today.setDate(today.getDate() + 5)
    }
    let time = {
      y: today.getFullYear(),
      m: today.getMonth(),
      d: today.getDate(),
      h: today.getHours(),
      j: today.getDay(),
      t: semaine[today.getDay()],
      n: mois[today.getMonth()],
    }
    return `${time.y}-${time.m + 1 < 10 ? '0' + (time.m + 1) : time.m + 1}-${
      time.d < 10 ? '0' + time.d : time.d
    }`
  }

  const todayDate = new Date().toLocaleDateString()

  console.log(datahours?.type?.current)
  return (
    <>
      <div className="body">
        {/* Début Header */}
        <div className="header">
          <div className="headergauche">
            <a href="https://github.com/Sebras22" className="Titre">
              <strong>Direct Météo</strong>
            </a>
            <form className="Barre" onSubmit={getPosition}>
              {' '}
              <input
                type="text"
                placeholder="Ville"
                name=""
                id=""
                onChange={(event) => setVille(event.target.value)}
              />
              <button>Rechercher</button>
            </form>
          </div>
          <div className="headerdroit">
            <div className="descriptif">
              {city == '' ? (
                ''
              ) : (
                <>
                  {!error && (
                    <img
                      className="image"
                      src={
                        datahours?.current?.rain == 0
                          ? 'https://images.unsplash.com/photo-1419833173245-f59e1b93f9ee?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                          : datahours?.current?.rain > 5
                          ? 'https://images.unsplash.com/photo-1590861115101-ef19a4191cd2?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                          : 'https://images.unsplash.com/photo-1614959909713-128c622fad23?auto=format&fit=crop&q=80&w=2127&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                      }
                      alt=""
                    />
                  )}
                  {/* Information sur la météo actuelle */}
                  <div className="InfoDirect">
                    <div>{city}</div>
                    <div>{todayDate}</div>
                    <div>
                      {!error && (
                        <div>
                          {datahours?.current?.rain ??
                            'Aucune information disponible'}
                          mm
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Fin Header */}
        {/* Corps de Page */}
        {ville === '' ? (
          <div className="Animation">
            <Nuage />
          </div>
        ) : (
          <>
            {/* Cordonnées et Ville rentrée */}
            <div>
              {ville == '' ? (
                ''
              ) : (
                <div className="Ville">
                  {' '}
                  {city}, {pays}{' '}
                </div>
              )}
              {lat == '' ? (
                ''
              ) : (
                <div className="Coordonnées">
                  {' '}
                  {lat} - {long}{' '}
                </div>
              )}
            </div>
            {/* Carrousel de Card avec le temps de chaque jour */}
            <div className="carrousel">
              <div className="Disposition">
                {!error &&
                  data?.daily?.time.map((el, index) => {
                    return (
                      <>
                        {/* Changement de couleur de la card en fonction de la température */}
                        <div
                          key={index}
                          className={
                            data?.daily?.temperature_2m_max[index] > 15
                              ? 'container1'
                              : 'container'
                          }
                        >
                          {/* Haute de La card */}
                          <div className="CardHaut">
                            <div>
                              {/* Date */}
                              <p className="Jour">
                                {' '}
                                {getDay(el)} {getNumber(el)}{' '}
                              </p>
                              <p className="Jour">{getMonth(el)}</p>
                            </div>
                          </div>
                          <div className="SunDisposition">
                            <div className="SunBox">
                              <img
                                className="Sunrise"
                                src={sunriseImage}
                                alt=""
                              />
                              {/* Levé / couché du soleil */}
                              <div className="SunTime">
                                <p>{getHours(data?.daily?.sunrise[index])}</p>
                                <p>{getHours(data?.daily?.sunset[index])}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            {/* Image en fonction du temps */}
                            <div className="Temps">
                              <img
                                className="ImgTemps"
                                src={
                                  data?.daily?.precipitation_sum[index] === 0
                                    ? sunImage
                                    : data?.daily?.precipitation_sum[index] > 5
                                    ? rainImage
                                    : partiellementnuage
                                }
                                alt=""
                              />
                            </div>
                            {/* Température minimale & maximale de la journée */}
                            <div className="alltemperature">
                              <div className="temperature">
                                <p>
                                  {data?.daily?.temperature_2m_min[index] ==
                                  null
                                    ? 'Aucune Information Disponible'
                                    : data?.daily?.temperature_2m_min[
                                        index
                                      ]}{' '}
                                  °C
                                </p>
                                <p>
                                  {data?.daily?.temperature_2m_max[index] ==
                                  null
                                    ? 'Aucune Information Disponible'
                                    : data?.daily?.temperature_2m_max[
                                        index
                                      ]}{' '}
                                  °C
                                </p>
                              </div>
                              <div className="degrade"></div>
                            </div>
                          </div>
                          {/* Information sur les précipitations */}
                          {data?.daily?.precipitation_sum[index] < 0.5 ? (
                            <p className="pluie">Pas de pluie !</p>
                          ) : (
                            <div className="pluie">
                              {' '}
                              {data?.daily?.precipitation_sum[index]} mm
                            </div>
                          )}{' '}
                          {/* Bas de la Card */}
                          <div className="CardBas">
                            <div>
                              {/* Pourcentage de pluie */}
                              {data?.daily?.precipitation_probability_max[
                                index
                              ] == null
                                ? 'Aucune Information Disponible'
                                : data?.daily?.precipitation_probability_max[
                                    index
                                  ]}{' '}
                              %
                            </div>
                            {/* Vitesse du vent */}
                            <div>
                              {data?.daily?.windspeed_10m_max[index] == null
                                ? 'Aucune Information Disponible'
                                : data?.daily?.windspeed_10m_max[index]}{' '}
                              km/h
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })}
              </div>
            </div>
          </>
        )}
        {ville === '' ? (
          <></>
        ) : (
          <>
            <div className="FooterParent">
              <div className="Footer">
                <div className="Footertext">
                  Developed & Designed by{' '}
                  <a href="https://github.com/Sebras22">Seb</a>
                </div>
                <div>
                  Icons by <a href="icons8.com ">Icon8</a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
