const { setupRoutes } = require('./routers')

const routes = {}

const setupPathAndController = (path, controller, method) => {
  routes[path] = { ...routes[path], [method]: controller }
}

const routers = {
  get: (path, controller) => setupPathAndController(path, controller, 'get'),
  post: (path, controller) => setupPathAndController(path, controller, 'post'),
  put: (path, controller) => setupPathAndController(path, controller, 'put'),
  patch: (path, controller) => setupPathAndController(path, controller, 'patch'),
  delete: (path, controller) => setupPathAndController(path, controller, 'delete'),
}

setupRoutes(routers)

module.exports = {
  routes,
}
