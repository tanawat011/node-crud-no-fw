const { apiPrefix, HTTP_STATUS } = require('../constants')
const crud = require('../helpers/crud')

const routeFeatures = `${apiPrefix}/features`
const routeFeatureId = `${apiPrefix}/features/:id`

const featureRoute = (routers) => {
  routers.get(routeFeatureId, (req, res) => {
    res.status(HTTP_STATUS.SUCCESS).json({ test: 'get feature by id' })
  })

  routers.get(routeFeatures, (req, res) => {
    res.status(HTTP_STATUS.SUCCESS).json({ test: 'get feature list' })
  })

  routers.post(routeFeatures, async (req, res) => {
    await crud.create('features', req.body)
    res.status(HTTP_STATUS.SUCCESS).json({ test: 'created feature' })
  })

  routers.patch(routeFeatureId, (req, res) => {
    res.status(HTTP_STATUS.SUCCESS).json({ test: 'updated feature' })
  })

  routers.delete(routeFeatureId, (req, res) => {
    res.status(HTTP_STATUS.SUCCESS).json({ test: 'deleted feature' })
  })
}

module.exports = {
  featureRoute,
  routeFeatures,
  routeFeatureId,
}
