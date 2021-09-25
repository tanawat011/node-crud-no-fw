const getMethod = (req) => {
  req.method = req.method.toLowerCase()
}

const getRouteAndParams = (req, path, routes) => {
  let pathSplitSlash = path.split('/')

  const route = Object.entries(routes)
    .filter(([routeKey]) => {
      const routeKeySplitSlash = routeKey.split('/')

      if (pathSplitSlash.length === routeKeySplitSlash.length) {
        if (routeKey.includes(path)) {
          return true
        }

        pathSplitSlash = pathSplitSlash.map((pathSlash, index) => {
          const routeKeySlash = routeKeySplitSlash[index]

          if (pathSlash === routeKeySlash) {
            return pathSlash
          }

          getParams(req, routeKeySlash, pathSlash)

          return routeKeySlash
        })

        if (routeKey.includes(pathSplitSlash.join('/'))) {
          return true
        }
      }

      return false
    })
    .map(([, value]) => value)[0]

  if (!route) {
    return routes['notFound']
  }

  return route[req.method]
}

const getParams = (req, key, value) => {
  req.params = { ...req.params, [key.replace(':', '')]: value }
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
