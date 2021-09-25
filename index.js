const http = require('http')
const serve = require('./src')
const logger = require('./src/utils/logger')

const PORT = 3000

const server = http.createServer(serve.initialServer)

server.listen(PORT, () => {
  logger.info(`server started on port: ${PORT}`)
})
