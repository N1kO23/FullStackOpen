require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

const PORT = process.env.PORT || 3001; // The listening port of the backend

// Legacy code osion 3 alkuun
// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

app.get("/info", (request, response) => {
  const date = new Date();
  Person.find({})
    .then((persons) => {
      response.send(
        `<p>Phonebook has info for ${
          persons.length
        } people</p>\n<p>${date.toString()}</p>`
      );
    })
    .catch((err) => next(err));
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      if (!person) return response.status(404).end();
      else response.json(person);
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const personToAdd = request.body;

  // Katotaan että parametrit on määritelty
  if (!personToAdd.name)
    next({
      name: "UndefinedName",
      message: "request parameter 'name' is not defined",
    });
  if (!personToAdd.number)
    next({
      name: "UndefinedNumber",
      message: "request parameter 'number' is not defined",
    });
  // Dupe check, osan 3 alkuun
  // const foundPerson = persons.find(
  //   (person) => person.name === personToAdd.name
  // );
  // if (foundPerson)
  // return response.status(400).json({ error: "name must be unique" });

  const person = new Person({
    name: personToAdd.name,
    number: personToAdd.number,
  });

  person
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  // Katotaan että parametrit on määritelty
  if (!body.name)
    next({
      name: "UndefinedName",
      message: "request parameter 'name' is not defined",
    });
  if (!body.number)
    next({
      name: "UndefinedNumber",
      message: "request parameter 'number' is not defined",
    });

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError")
    return response.status(400).send({ error: "malformatted id" });
  if (error.name === "UndefinedName")
    return response.status(400).send({ error: "name is not defined" });
  if (error.name === "UndefinedNumber")
    return response.status(400).send({ error: "number is not defined" });

  next(error);
};

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
