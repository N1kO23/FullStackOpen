import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/3.0'

const fetchWeather = (lat, lng) => {
    return axios.get(`${baseUrl}/onecall?lat=${lat}&lon=${lng}&appid=${import.meta.env.VITE_OWM_KEY}`)
}

export default {
    fetchWeather,
}