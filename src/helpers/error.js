const logger = require('../utils/logger')

const errorHandler = (err, reject) => {
  if (err) {
    logger.error(err.message, { ...err })
    reject(err)
  }
}

module.exports = {
  errorHandler,
}
