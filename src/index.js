const url = require('url')

const { HTTP_METHOD, HTTP_STATUS } = require('./constants')
const { apiLogger } = require('./helpers/apiLogger')
const { diffTimestamp } = require('./helpers/datetime')
const { routes } = require('./routes')
const { getMethod, getRouteAndParams, getQuery, getBody } = require('./utils/request')
const { setHeaders } = require('./utils/response')

const initialServer = async (req, res) => {
  const startTimestamp = new Date().getTime()

  setHeaders(res)

  if (req.method === HTTP_METHOD.OPTIONS) {
    res.log(req)
    res.writeHead(HTTP_STATUS.NO_CONTENT, addonResponseHeaders)
    res.end()

    return
  }

  req.query = undefined
  req.params = undefined
  req.log = apiLogger

  res.log = apiLogger

  routes.notFound = async (_, res) => {
    res.statusCode = HTTP_STATUS.NOT_FOUND
    res.end(JSON.stringify({ message: 'Path not found' }))
  }

  const baseUri = url.parse(req.url, true)
  const path = baseUri.pathname

  getMethod(req)
  getQuery(req, baseUri)
  const route = getRouteAndParams(req, path, routes)

  console.log(route)

  req.on('data', async (data) => {
    getBody(req, data)
  }).on('end', async () => {
    const payload = {
      method: req.method,
      headers: req.headers,
      path,
      query: req.query,
      params: req.params,
      body: req.body,
    }

    await route(payload, res)

    res.log(req, res.statusCode, diffTimestamp(startTimestamp))
    res.end()
  })
}

module.exports = {
  initialServer,
}
