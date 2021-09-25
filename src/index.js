const url = require('url')

const { HTTP_METHOD, HTTP_STATUS } = require('./constants')
const { apiLogger } = require('./helpers/apiLogger')
const { routes } = require('./routes')

const initialServer = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Max-Age', 2592000)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('X-Powered-By', 'TanawatDEVz')

  res.log = apiLogger

  if (req.method === HTTP_METHOD.OPTIONS) {
    res.log(req)
    res.writeHead(HTTP_STATUS.NO_CONTENT, addonResponseHeaders)
    res.end()

    return
  }

  const method = req.method.toLowerCase()
  const headers = req.headers
  const baseUri = url.parse(req.url, true)
  const path = baseUri.pathname
  const query = { ...baseUri.query }
  const params = routes.find()

  console.log({ ...req })
  console.log(baseUri)

  routes.notFound = (req, res) => {
    res.statusCode = HTTP_STATUS.NOT_FOUND
    res.end(JSON.stringify({ message: 'Path not found' }))
  }

  req.on('data', async (data) => {
    req.body = JSON.parse(data)
  }).on('end', async () => {
    let route = routes[path]

    if (!route || (route && !route[method])) {
      route = routes['notFound']
    } else {
      route = routes[path][method]
    }

    const payload = {
      method,
      headers,
      path,
      query,
      params,
      body: req.body,
    }

    await route(payload, res)

    res.log(req)
    res.end()
  })
}

module.exports = {
  initialServer,
}
