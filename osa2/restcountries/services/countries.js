import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const fetchAll = () => {
    return axios.get(`${baseUrl}/all`)
}

const fetchByName = (name) => {
    return axios.get(`${baseUrl}/name/${name}`)
}

export default {
    fetchAll,
    fetchByName
}