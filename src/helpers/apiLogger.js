const logger = require('../utils/logger')

const apiLogger = (req, status, duration, success) => {
  const data = {
    method: req.method,
    path: req.url,
    from: '',
    userAgent: '',
    status,
    duration,
    success,
  }
  logger.info(data)
}

module.exports = {
  apiLogger,
}