const express = require("express");
const app = express();
app.use(express.json());
let persons = require("./data");
const morgan = require("morgan");
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'));
// app.use(morgan("dev"));

morgan.token("body", (request) => JSON.stringify(request.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

//limiting on get request.

app.get("/", (request, response) => {
  response.send("Hello World");
});

//retrieve all resource...
app.get("/api/persons", (request, response) => {
  try {
    if (persons.length > 0) {
      response.status(200).json(persons);
    } else {
      res.status(404).json({ message: "No person available, add one!" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/info", (req, res) => {
  const numberOfPeople = persons.length;
  const currentDate = new Date();
  const responseText = `
    <p>Phonebook has info for ${numberOfPeople} people</p>
    <p>${currentDate}</p>
  `;
  res.send(responseText);
});

//retrieve single resource...
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(400).json({ message: "person is not found!" });
  }
  try {
    response.status(200).json(person);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return response
      .status(404)
      .json({ message: `Person with id ${id} not found!` });
  }
  try {
    const personName = person.name;
    persons = persons.filter((person) => person.id !== id);
    response
      .status(204)
      .json({ message: `person ${personName} deleted successfully!` });
  } catch (error) {
    console.error("Error occurred:", error);
    response.status(500).json({ message: "An error occurred" });
  }
});

//add a person to phonebook..
//generate random id
const generateId = () => Math.floor(Math.random() * 99999);
const isMissingOrEmpty = (value) => !value || value.trim() === "";

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body.number);
  const nameExist = persons.find((person) => person.name === body.name);
  if (isMissingOrEmpty(body.name) || isMissingOrEmpty(body.number)) {
    return response.status(400).json({
      error: "The name or number is missing",
    });
  } else if (nameExist) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);
  response.json(person);
});

module.exports = app;
