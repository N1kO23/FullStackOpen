import { useState, useEffect } from 'react';
import countryService from '../services/countries';
import weatherService from '../services/weather';


const Weather = ({ capital, current }) => {
  return (
    <>
      <h3>Weather in {capital[0]}</h3>
      <p>Temperature: {(current.temp - 273.15).toFixed(2)} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`} alt="" />
      <p>Wind: {(current.wind_speed).toFixed(2)} m/s</p>
    </>
  )
}

const Country = ({ name, capital, area, languages, flags, latlng }) => {

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService.fetchWeather(latlng[0], latlng[1]).then(response => {
      setWeather(response.data);
    }).catch((err) => {
      setWeather(null);
      console.error(err.response);
    })
  }, [latlng])

  return (
    <>
      <h2>{name.common}</h2>
      <p>Capital: {capital[0]}</p>
      <p>Area: {area}</p>
      <h4>Languages:</h4>
      <ul>
        {Object.values(languages).map((entry) => {
          return (
            <li key={entry}>{entry}</li>
          )
        })}
      </ul>
      <img src={flags.png} alt="" />
      {weather && (
        <>
          <Weather capital={capital[0]} {...weather} />
        </>
      )}
    </>
  )
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [expandedCountry, setExpandedCountry] = useState(null);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOnExpand = async (name) => {
    const result = await countryService.fetchByName(name);
    setExpandedCountry(result.data);
  }

  useEffect(() => {
    const fetchAndFilterCountries = async () => {
      try {
        const response = await countryService.fetchAll();
        if (response.status !== 200) {
          setCountries([]);
          console.error(response);
          return;
        }
        const query = searchQuery.toLowerCase();

        const filtered = response.data.filter(entry =>
          entry.name.official.toLowerCase().includes(query) ||
          entry.name.common.toLowerCase().includes(query)
        );

        setCountries(filtered);

        // Check for an exact match in the common or official names
        const exactMatch = response.data.find(
          entry =>
            entry.name.official.toLowerCase() === query ||
            entry.name.common.toLowerCase() === query
        );

        if (exactMatch) {
          const result = await countryService.fetchByName(exactMatch.name.common.toLowerCase());
          if (response.status !== 200) {
            setExpandedCountry(null);
            console.error(result);
            return;
          }
          setExpandedCountry(result.data);
        } else if (filtered.length === 1) {
          const result = await countryService.fetchByName(filtered[0].name.common.toLowerCase());
          if (response.status !== 200) {
            setExpandedCountry(null);
            console.error(result);
            return;
          }
          setExpandedCountry(result.data);
        } else {
          setExpandedCountry(null);
        }

      } catch (err) {
        setError(`Error fetching countries: ${err.message}`);
      }
    };

    if (searchQuery) {
      fetchAndFilterCountries();
    } else {
      setCountries([]);
      setExpandedCountry(null);
    }
  }, [searchQuery]);

  return (
    <div>
      <div>
        find countries <input value={searchQuery} onChange={handleSearchQueryChange} type="text" />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {countries.length > 10 ? (
        <div>Too many results, try a different filter</div>
      ) : (
        <>
          {expandedCountry ? (
            <Country {...expandedCountry} />
          ) : (
            countries.map((country) => (
              <div key={country.cca3}>
                {country.name.common} <button onClick={() => handleOnExpand(country.name.common)}>Show</button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default App;