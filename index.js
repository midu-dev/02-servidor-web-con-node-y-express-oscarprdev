// Ejercicio 1: crear servidor HTTP con Node
const http = require('node:http')
const fs = require('node:fs/promises')
const ROUTES = require('./routes')

const PORT = process.env.PORT ?? 1234

function endWithMethodNotAllowed(res) {
  res.statusCode = 405
  return res.end('<h1>Method Not Allowed</h1>')
}

async function retrieveLogo(res) {
  try {
    const data = await fs.readFile('./assets/logo.webp')
    res.setHeader('Content-Type', "image/webp")

    return res.end(data)
  } catch (e) {
    res.statusCode = 500

    return res.end('<h1>500 Internal Server Error</h1>')
  }
}

function retrieveContact(req, res) {
  let body = ''

  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(body)

    if (Object.keys(data).some(key => !['name', 'email', 'message'].includes(key))) {
      res.statusCode = 400
      return res.end('<h1>Invalid request body</h1>')
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.statusCode = 201
    return res.end(JSON.stringify(data))
  })
}

async function processRequest(req, res) {
  const {method, url} = req
  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  // return server
  switch (url) {
    case ROUTES.INITIAL: {
      return method !== 'GET'
        ? endWithMethodNotAllowed(res)
        : res.end('<h1>¡Hola mundo!</h1>')
    }
    case ROUTES.LOGO: {
      return method !== 'GET'
        ? endWithMethodNotAllowed(res)
        : retrieveLogo(res)
    }
    case ROUTES.CONTACTO: {
      return method !== 'POST'
        ? endWithMethodNotAllowed(res)
        : retrieveContact(req, res)
    }
    default: {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8')

      res.statusCode = 404
      return res.end('<h1>404</h1>')
    }
  }
}

const server = http.createServer(processRequest);

function startServer () {
  return server.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`))
}

module.exports = {
  startServer
}
