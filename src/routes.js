const { HTTP_STATUS } = require('./constants')
const crud = require('./helpers/crud')

const routes = {}

const setupPathAndController = (path, controller, method) => {
  routes[path] = { ...routes[path], [method]: controller }
}

const route = {
  get: (path, controller) => setupPathAndController(path, controller, 'get'),
  post: (path, controller) => setupPathAndController(path, controller, 'post'),
  put: (path, controller) => setupPathAndController(path, controller, 'put'),
  patch: (path, controller) => setupPathAndController(path, controller, 'patch'),
  delete: (path, controller) => setupPathAndController(path, controller, 'delete'),
}

route.get('/api/v1/tables', (req, res) => {
  res.status(HTTP_STATUS.SUCCESS).json({ test: 'get table list' })
})

route.post('/api/v1/tables', async (req, res) => {
  await crud.create('tables', req.body)
  res.status(HTTP_STATUS.CREATED).json({ test: 'created table' })
})

route.get('/api/v1/tables/:id', (req, res) => {
  res.status(HTTP_STATUS.SUCCESS).json({ test: 'Get table by id ' + req.params.id })
})

route.get('/api/v1/tables/:id/columns', (req, res) => {
  res.status(HTTP_STATUS.SUCCESS).json({ test: 'Get column list by table id ' + req.params.id })
})

route.get('/api/v1/tables/:id/columns/:columnId', (req, res) => {
  res.status(HTTP_STATUS.SUCCESS).json({ test: `Get column by ${req.params.columnId} and table ${req.params.id}` })
})

route.get('/api/v1/tables/:id/:columnId', (req, res) => {
  res.status(HTTP_STATUS.SUCCESS).json({ test: `Get column by ${req.params.columnId} and table ${req.params.id} without path column` })
})

module.exports = {
  routes,
}
