import { useState } from "react";
import "./App.css";

function App() {
    const getData = async (latitude, longitude) => {
        const response = await fetch(
            `https://api.open-meteo.com/v1/meteofrance?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&start_date=${getDate()}&end_date=${getDate(
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
        return `${time.t} ${time.d} ${time.n} ${time.y}`;
    };

    const getDate = (isAdd = false) => {
        let today = new Date();
        if (isAdd) {
            today.setDate(today.getDate() + 2);
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
            <div>
                <p className="Titre">
                    <strong>DirectMétéo</strong>
                </p>
            </div>
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
            <div className="Ville">
                {city}, {pays}
            </div>
            <br />
            <div className="Ville">
                {lat} - {long}
            </div>
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
                                    <br />
                                    Température Min:{" "}
                                    {data?.daily?.temperature_2m_min[index] ==
                                    null
                                        ? "Aucune Information Disponible"
                                        : data?.daily?.temperature_2m_min[
                                              index
                                          ]}{" "}
                                    C°
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
                                    Vitesse de vent:{" "}
                                    {data?.daily?.windspeed_10m_max[index] ==
                                    null
                                        ? "Aucune Information Disponible"
                                        : data?.daily?.windspeed_10m_max[
                                              index
                                          ]}{" "}
                                    km/h
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}

export default App;
