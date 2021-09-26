const { apiLogger } = require('../helpers/apiLogger')

const serverResponseSetup = (res) => {
  res.log = apiLogger

  res.status = (code) => {
    res.statusCode = code

    return res
  }

  res.send = (str) => {
    return res.end(str)
  }

  res.json = (data) => {
    return res.end(JSON.stringify(data))
  }
}

const serverRequestSetup = (req) => {
  req.log = apiLogger
  req.query = undefined
  req.params = undefined
}

module.exports = {
  serverResponseSetup,
  serverRequestSetup,
}
