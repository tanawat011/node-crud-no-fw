const url = require('url')

const { HTTP_METHOD, HTTP_STATUS } = require('./constants')
const { apiLogger } = require('./helpers/apiLogger')
const { diffTimestamp } = require('./helpers/datetime')
const { serverRequestSetup, serverResponseSetup } = require('./libs/http')
const { routes } = require('./routes')
const { getMethod, getRouteAndParams, getQuery, getBody } = require('./utils/request')
const { setHeaders } = require('./utils/response')

const initialServer = async (req, res) => {
  const startTimestamp = new Date().getTime()

  serverRequestSetup(req)
  serverResponseSetup(res)
  setHeaders(res)

  if (req.method === HTTP_METHOD.OPTIONS) {
    res.status(HTTP_STATUS.NO_CONTENT).send()

    return
  }

  routes.notFound = async (_, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Path not found' })
  }

  const baseUri = url.parse(req.url, true)
  const path = baseUri.pathname

  getMethod(req)
  getQuery(req, baseUri)
  const route = getRouteAndParams(req, path, routes)

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
  })
}

module.exports = {
  initialServer,
}
