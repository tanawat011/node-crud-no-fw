const { HTTP_STATUS } = require('./constants')
const crud = require('./helpers/crud')

const routes = {
  '/api/v1/tables': {
    post: async (req, res) => {
      await crud.create('tables', req.body)
      res.statusCode = HTTP_STATUS.CREATED
      res.write('Created table')
    },
    get: async (req, res) => {
      res.statusCode = HTTP_STATUS.SUCCESS
      res.write('Get table list')
    },
  },
  '/api/v1/tables/:id': {
    get: async (req, res) => {
      res.statusCode = HTTP_STATUS.SUCCESS
      res.write('Get table by id ' + req.params.id)
    },
  },
  '/api/v1/tables/:id/columns': {
    get: async (req, res) => {
      res.statusCode = HTTP_STATUS.SUCCESS
      res.write('Get column list by table id ' + req.params.id)
    },
  },
  '/api/v1/tables/:id/columns/:columnId': {
    get: async (req, res) => {
      res.statusCode = HTTP_STATUS.SUCCESS
      res.write(`Get column by ${req.params.columnId} and table ${req.params.id}`)
    },
  },
  '/api/v1/tables/:id/:columnId': {
    get: async (req, res) => {
      res.statusCode = HTTP_STATUS.SUCCESS
      res.write(`Get column by ${req.params.columnId} and table ${req.params.id} without path column`)
    },
  },
}

module.exports = {
  routes,
}