const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001; // The listening port of the backend

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p>\n<p>${date.toString()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const person = persons.find((person) => person.id === id);

  if (person) response.json(person);
  else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const foundPerson = persons.find((person) => person.id === id);

  if (!foundPerson) {
    response.status(404).end();
  } else {
    persons = persons.filter((person) => person.id !== id);
    response.status(204).end();
  }
});

app.post("/api/persons", (request, response) => {
  const personToAdd = request.body;

  // Katotaan että parametrit on määritelty
  if (!personToAdd.name)
    return response.status(400).json({ error: "name is not defined" });
  if (!personToAdd.number)
    return response.status(400).json({ error: "number is not defined" });

  // Dupe check
  const foundPerson = persons.find(
    (person) => person.name === personToAdd.name
  );
  if (foundPerson)
    return response.status(400).json({ error: "name must be unique" });

  // Lisäys
  const newPerson = {
    name: personToAdd.name,
    number: personToAdd.number,
    id: getRandomInt(10000000).toString(),
  };
  persons.push(newPerson);
  response.status(201).json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
