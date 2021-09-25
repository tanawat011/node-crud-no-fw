const LOG = {
  COLOR: {
    RED: '\x1B[31m',
    GREEN: '\x1B[32m',
    BLUE: '\x1B[34m',
    WHITE: '\x1B[37m',
  },
  TYPE: {
    INFO: 'info',
    ERROR: 'error',
    DEBUG: 'debug',
  }
}

const logging = (type, color, payload = '', metadata = '', isFormated = false) => {
  const spacer = isFormated ? 2 : null
  const enterer = isFormated ? '\n' : ''

  if (typeof payload === 'object') {
    payload = `${JSON.stringify(payload, null, spacer)}`
  }

  if (metadata) {
    if (typeof metadata === 'object') {
      metadata = `${enterer}${JSON.stringify(metadata, null, spacer)}`
    }

    metadata = ` ${metadata}`
  }

  console.log(`${new Date().toISOString()} ${color}${type}${LOG.COLOR.WHITE}: ${payload}${metadata}`)
}

const info = (payload = '', metadata = '') => {
  logging(LOG.TYPE.INFO, LOG.COLOR.GREEN, payload, metadata)
}

const error = (payload, metadata) => {
  logging(LOG.TYPE.ERROR, LOG.COLOR.RED, payload, metadata)
}

const debug = (payload, metadata) => {
  logging(LOG.TYPE.DEBUG, LOG.COLOR.BLUE, payload, metadata, true)
}

module.exports = {
  LOG,
  info,
  error,
  debug,
}
