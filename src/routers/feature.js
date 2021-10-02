const { HTTP_STATUS } = require('../constants')
const crud = require('../helpers/crud')

const routeFeatures = '/features'
const routeFeatureId = '/features/:id'

const featureRoute = (routers) => {
  routers.get(routeFeatureId, async (req, res) => {
    const payload = { id: req.params.id }

    const feature = await crud._find('features', payload)

    feature.data = feature.data[0]

    res.status(HTTP_STATUS.SUCCESS).json(feature)
  })

  routers.get(routeFeatures, async (req, res) => {
    const features = await crud._find('features', req.query, true)

    features.total = features.data.length

    res.status(HTTP_STATUS.SUCCESS).json(features)
  })

  routers.post(routeFeatures, async (req, res) => {
    const feature = await crud._create('features', req.body)

    res.status(HTTP_STATUS.CREATED).json(feature)
  })

  routers.patch(routeFeatureId, async (req, res) => {
    const feature = await crud._update('features', req.params.id, req.body)

    res.status(HTTP_STATUS.SUCCESS).json(feature)
  })

  routers.delete(routeFeatureId, async (req, res) => {
    const result = await crud._delete('features', req.params.id)

    res.status(HTTP_STATUS.NO_CONTENT).json(result)
  })
}

module.exports = {
  featureRoute,
}
