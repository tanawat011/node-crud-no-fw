const { HTTP_STATUS } = require('../constants')
const crud = require('../helpers/crud')

const routeColumns = '/features/:featureId/columns'
const routeColumnId = '/features/:featureId/columns/:id'

const columnRoute = (routers) => {
  routers.get(routeColumnId, async (req, res) => {
    const payload = { ...req.params }

    const column = await crud._find('columns', payload)

    column.data = column.data[0]

    res.status(HTTP_STATUS.SUCCESS).json(column)
  })

  routers.get(routeColumns, async (req, res) => {
    const columns = await crud._find('columns', req.query, true)

    columns.total = columns.data.length

    res.status(HTTP_STATUS.SUCCESS).json(columns)
  })

  routers.post(routeColumns, async (req, res) => {
    const { body: payload } = req

    payload.featureId = req.params.featureId

    const column = await crud._create('columns', payload)

    res.status(HTTP_STATUS.SUCCESS).json(column)
  })

  routers.patch(routeColumnId, async (req, res) => {
    const { body: payload } = req

    payload.featureId = req.params.featureId

    const column = await crud._update('columns', req.params.id, payload)

    res.status(HTTP_STATUS.SUCCESS).json(column)
  })

  routers.delete(routeColumnId, async (req, res) => {
    const result = await crud._delete('columns', req.params.id)

    res.status(HTTP_STATUS.SUCCESS).json(result)
  })
}

module.exports = {
  columnRoute,
}
