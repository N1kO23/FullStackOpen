import axios from "axios";
const baseUrl = "/api/persons"; // kun ajetaan backendin kautta

const getAllPersons = () => {
  return axios.get(baseUrl);
};

const createPerson = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const updatePerson = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {
  getAllPersons,
  createPerson,
  updatePerson,
  deletePerson,
};
