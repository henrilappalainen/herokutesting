const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

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

app.get('/', (req, res) => {
    res.send('Notes backend')
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find( note => {
        return note.id === id
    })
    if ( note ) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

const generateId = () => {
    const maxId = notes.length > 0 ? notes.map(n => n.id).sort((a,b) => a - b).reverse()[0] : 1
    return maxId + 1
  }
  
app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (body.content === undefined) {
        return response.status(400).json({error: 'content missing'})
    }
  
    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }
  
    notes = notes.concat(note)
  
    response.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    
    res.status(204).end()
})
  
app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})
