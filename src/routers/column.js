const { HTTP_STATUS } = require('../constants')
const { routeFeatureId } = require('./feature')
const crud = require('../helpers/crud')

const routeColumns = `${routeFeatureId}/columns`
const routeColumnId = `${routeFeatureId}/columns/:columnId`

const columnRoute = (routers) => {
  routers.get(routeColumnId, (req, res) => {
    res.status(HTTP_STATUS.SUCCESS).json({ test: 'get column by id' })
  })

  routers.get(routeColumns, (req, res) => {
    res.status(HTTP_STATUS.SUCCESS).json({ test: 'get column list' })
  })

  routers.post(routeColumns, async (req, res) => {
    await crud.create('features', req.body)
    res.status(HTTP_STATUS.SUCCESS).json({ test: 'created column' })
  })

  routers.patch(routeColumnId, (req, res) => {
    res.status(HTTP_STATUS.SUCCESS).json({ test: 'updated column' })
  })

  routers.delete(routeColumnId, (req, res) => {
    res.status(HTTP_STATUS.SUCCESS).json({ test: 'deleted column' })
  })
}

module.exports = {
  columnRoute,
  routeColumns,
  routeColumnId,
}
