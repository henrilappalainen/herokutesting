const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Note = require('./models/note')

const logger = (request, response, next) => {
  console.log('Method:',request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const error = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(express.static('build'))

app.use(cors())

app.use(bodyParser.json())

app.use(logger)

let notes = [
    {
      id: 1,
      content: 'HTML on helppoa',
      date: '2017-12-10T17:30:31.098Z',
      important: true
    },
    {
      id: 2,
      content: 'Selain pystyy suorittamaan vain javascriptiä',
      date: '2017-12-10T18:39:34.091Z',
      important: false
    },
    {
      id: 3,
      content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
      date: '2017-12-10T19:20:14.298Z',
      important: true
    }
]

const formatNote = (note) => {
    return {
      content: note.content,
      date: note.date,
      important: note.important,
      id: note._id
    }
}

app.get('/api', (req, res) => {
    res.send('Notes backend')
})

app.get('/api/notes', (request, response) => {
    Note
      .find({})
      .then(notes => {
        response.json(notes.map(formatNote))
      })
})

app.get('/api/notes/:id', (request, response) => {
    Note
      .findById(request.params.id)
      .then(note => {
        if (note) {
            response.json(formatNote(note))
        } else {
            response.status(404).end()
        }
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note
    .save()
    .then(savedNote => {
      response.json(formatNote(savedNote))
    })
})

app.delete('/api/notes/:id', (request, response) => {
  Note
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/notes/:id', (request, response) => {
    const body = request.body
  
    const note = {
      content: body.content,
      important: body.important
    }
  
    Note
      .findByIdAndUpdate(request.params.id, note, { new: true } )
      .then(updatedNote => {
        response.json(formatNote(updatedNote))
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
  })

  
app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})
