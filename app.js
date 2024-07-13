const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const Phonebook = require('./models/person')
const errorHandler = require('./utils/errorHandler')

// Middleware setup
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// Static file serving
app.use(express.static(path.join(__dirname, 'dist')))

// Routes...
// Retrieve all persons
app.get('/api/persons', async (req, res, next) => {
  await Phonebook.find({})
    .then((persons) => res.status(200).json(persons))
    .catch((error) => next(error))
})

app.get('/info', async (req, res, next) => {
  await Phonebook.countDocuments({})
    .then((count) => {
      const responseText = `
    <p>Phonebook has info for ${count} people</p>
    <p>${new Date()}</p>
  `
      res.send(responseText)
    })
    .catch((error) => next(error))
})

//retrieve single resource...
app.get('/api/persons/:id', async (req, res, next) => {
  const id = req.params.id
  await Phonebook.findById(id)
    .then((person) => {
      if (!person) {
        res.status(400).json({ message: 'person is not found!' })
      }
      return res.status(200).json(person)
    })
    .catch((error) => {
      next(error)
    })
})

app.delete('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id
  await Phonebook.findByIdAndDelete(id)
    .then((person) => {
      if (!person) {
        return response
          .status(404)
          .json({ message: `Person with id ${id} not found!` })
      }
      response.status(204).end()
    })
    .catch((error) => next(error))
})

//add a person to phonebook..
//generate random id
const generateId = () => Math.floor(Math.random() * 99999)
const isMissingOrEmpty = (value) => !value || value.trim() === ''

app.post('/api/persons', async (req, res, next) => {
  const body = req.body
  if (isMissingOrEmpty(body.name) || isMissingOrEmpty(body.number)) {
    return res.status(400).json({
      error: 'The name or number is missing',
    })
  }
  await Phonebook.findOne({ name: body.name })
    .then((personExist) => {
      if (personExist) {
        return res.status(400).json({ error: 'Name must be unique' })
      }
      const person = new Phonebook({
        name: body.name,
        number: body.number,
        id: generateId(),
      })
      return person.save()
    })
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error))
})

//update person information..
app.put('/api/persons/:id', async (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  const id = request.params.id
  await Phonebook.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

// Serve the application frontend..
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => `Server running on port ${port} 🔥`)
