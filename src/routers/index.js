const { columnRoute } = require('./column')
const { featureRoute } = require('./feature')

const setupRoutes = (routers) => {
  columnRoute(routers)
  featureRoute(routers)
}

module.exports = { setupRoutes }
