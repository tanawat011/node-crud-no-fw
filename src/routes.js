const { ROUTES, HTTP_STATUS } = require('./constants')
const crud = require('./helpers/crud')

const routes = {
  [ROUTES.V1.TABLES]: {
    post: async (req, res) => {
      await crud.create('tables', req.body)
      res.statusCode = HTTP_STATUS.CREATED
      res.write('Created')
    },
    get: async (req, res) => {
      console.log(req.query)
      res.statusCode = HTTP_STATUS.SUCCESS
      res.write('Success')
    },
  },
  [ROUTES.V1.TABLES + '/:id']: {
    get: async (req, res) => {
      console.log(req.query)
      console.log(req.params)
      res.statusCode = HTTP_STATUS.SUCCESS
      res.write('Success')
    },
  },
}

module.exports = {
  routes,
}