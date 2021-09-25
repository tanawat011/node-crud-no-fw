const logger = require('../utils/logger')

const apiLogger = (req, status, duration, isSuccess = true) => {
  const data = {
    method: req.method,
    path: req.url,
    fromHost: req.headers['host'],
    fromIp: req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    status,
    duration,
    isSuccess,
  }
  logger.info(data)
}

module.exports = {
  apiLogger,
}