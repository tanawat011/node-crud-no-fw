const setHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Max-Age', 2592000)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('X-Powered-By', 'TanawatDEVz')
}

module.exports = {
  setHeaders,
}
