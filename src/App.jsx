import { useState } from "react";
import "./App.css";
import Nuage from './components/Nuage.jsx';

function App() {
    const getData = async (latitude, longitude) => {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,&daily=sunrise,sunset,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max&start_date=${getDate()}&end_date=${getDate(
                true
            )}&timezone=Europe%2FBerlin`
        );
        const res = await response.json();
        setData(res);
    };

    const getPosition = async (e) => {
        e.preventDefault();
        if (!ville) return;
        const geo = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${ville}`
        );
        const pos = await geo.json();
        if (pos?.results?.[0]) {
            const { latitude, longitude, name, country_code } =
                pos?.results?.[0];
            getData(latitude, longitude);
            setError(false);
            setCity(name);
            setPays(country_code);
            setLat(latitude);
            setLong(longitude);
        } else {
            setError(true);
            setCity("");
            setPays("");
            setLat("");
            setLong("");
        }
    };

    const semaine = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
    ];
    const mois = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décemnbre",
    ];

    const [data, setData] = useState({});

    const [error, setError] = useState(false);

    const [ville, setVille] = useState("");

    const [city, setCity] = useState("");

    const [pays, setPays] = useState("");

    const [lat, setLat] = useState("");

    const [long, setLong] = useState("");

    const trans = (time) => {
        return new Date(time);
    };

    const getTime = (timestamp) => {
        let today = new Date(timestamp);
        let time = {
            y: today.getFullYear(),
            m: today.getMonth(),
            d: today.getDate(),
            h: today.getHours(),
            t: semaine[today.getDay()],
            n: mois[today.getMonth()],
        };
        return `${time.t} ${time.d} ${time.n}`;
    };

    const getHours = (timestamp) => {
        const levesoleil = new Date(timestamp);
        const heures = levesoleil.getHours();
        const min = levesoleil.getMinutes();

        return `${heures}h${min < 10 ? 'O' : ''}${min}`
    };

    const getDate = (isAdd = false) => {
        let today = new Date();
        if (isAdd) {
            today.setDate(today.getDate() + 5);
        }
        let time = {
            y: today.getFullYear(),
            m: today.getMonth(),
            d: today.getDate(),
            h: today.getHours(),
            j: today.getDay(),
            t: semaine[today.getDay()],
            n: mois[today.getMonth()],
        };
        return `${time.y}-${
            time.m + 1 < 10 ? "0" + (time.m + 1) : time.m + 1
        }-${time.d < 10 ? "0" + time.d : time.d}`;
    };

    console.log(getDate());
    console.log(getDate(true));

    return (
        <div className="body">
            <div className="header">
                    <p className="Titre">
                        <strong>Direct Meteo</strong>
                    </p>
                <form className="Barre" onSubmit={getPosition}>
                    {" "}
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
            <div>
                {ville == "" ? "" :      <div className="Ville">  {city}, {pays}  </div>}
                {lat == "" ? "" :      <div className="Coordonnées"> {lat} - {long}  </div>}
            </div>
            <div>
        
            </div>
            {/* <Nuage /> */}
            <div className="Disposition">

            {!error &&
                data?.daily?.time.map((el, index) => {
                    return (
                        <div key={index} className="container">
                            <p className="Jour"> {getTime(el)} </p>
                            <div className="undercontainer">
                                <div className="Info">
                                    Température Max:{" "}
                                    {data?.daily?.temperature_2m_max[index] ==
                                    null
                                    ? "Aucune Information Disponible"
                                    : data?.daily?.temperature_2m_max[
                                        index
                                    ]}{" "}
                                    C° <br />
                                    {data?.daily?.temperature_2m_max[index] > 20 ? "IL FAIT CHAUD" : "IL FAIT FROID"}
                                    <br />
                                    Température Min:{" "}
                                    {data?.daily?.temperature_2m_min[index] ==
                                    null
                                        ? "Aucune Information Disponible"
                                        : data?.daily?.temperature_2m_min[
                                              index
                                          ]}{" "}
                                    °C
                                </div>
                                <div className="Info">
                                    Précipitation:{" "}
                                    {data?.daily?.precipitation_sum[index] ==
                                    null
                                    ? "Aucune Information Disponible"
                                    : data?.daily?.precipitation_sum[
                                              index
                                            ]}{" "}
                                    mm <br />
                                    <br />
                                    Sunrise:{getHours(data?.daily?.sunrise[index])}
                                    <br />
                                    Sunset:{getHours(data?.daily?.sunset[index])}
                                    <br />
                                    Vitesse de vent:{" "}
                                    {data?.daily?.windspeed_10m_max[index] ==
                                    null
                                    ? "Aucune Information Disponible"
                                    : data?.daily?.windspeed_10m_max[
                                        index
                                    ]}{" "}
                                    km/h
                                </div>
                                <div className="Info">
                                    Probabilité de Précipitation:{" "}
                                    {data?.daily?.precipitation_probability_max[index] ==
                                    null
                                    ? "Aucune Information Disponible"
                                    : data?.daily?.precipitation_probability_max[
                                        index
                                    ]}{" "}
                                    % <br />
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
        </div>

    );
}

export default App;
