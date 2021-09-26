const pathToRegexp = require('../libs/pathToRegexp')

const getMethod = (req) => {
  req.method = req.method.toLowerCase()
}

const getRouteAndParams = (req, path, routes) => {
  const route = Object.entries(routes)
    ?.find(([key]) => {
      const matched = pathToRegexp.match(key)(path)

      if (matched) {
        getParams(req, matched.params)
      }

      return matched
    })
    ?.find(value => typeof value === 'object')

  if (!route) {
    return routes['notFound']
  }

  return route[req.method]
}

const getParams = (req, params) => {
  req.params = { ...params }
}

const getQuery = (req, baseUri) => {
  if (Object.keys(baseUri.query).length > 0) {
    req.query = { ...baseUri.query }
  }
}

const getBody = (req, data) => {
  req.body = JSON.parse(data)
}

module.exports = {
  getMethod,
  getRouteAndParams,
  getParams,
  getQuery,
  getBody,
}
