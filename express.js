// Ejercicio 2: crear servidor HTTP con Express
const express = require('express')
const ROUTES = require('./routes')

const PORT = process.env.PORT ?? 1234

const app = express()
app.use(express.json())


function retrieveContact(req, res) {
  const { body } = req

  const requiredKeys = ['name', 'email', 'message']
  const isValid = requiredKeys.every((i) => body.hasOwnProperty(i))

  if (!isValid) {
    return res.status(400).send('<h1>Invalid request body</h1>')
  }

  return res.status(201).send(body)
}

function isMethodNotAllowed(req) {
  const {url} = req

  return Object.values(ROUTES).some(route => route === url)
}

app.get(ROUTES.INITIAL, (req, res) => res.send('<h1>¡Hola mundo!</h1>'))

app.get(ROUTES.LOGO, express.static('assets'))

app.post(ROUTES.CONTACTO, (req, res) => retrieveContact(req, res))

app.use((req, res) => {
  return isMethodNotAllowed(req)
    ? res.status(405).send('<h1>Method Not Allowed</h1>')
    : res.status(404).send('<h1>404</h1>')
})

function startServer () {
  return app.listen(PORT, () => console.log(`server listening on port http://localhost:${PORT}`))
}

module.exports = {
  startServer
}
