const fs = require('fs')
const errorUtils = require('./error')

const jsonFileType = 'utf8'

const create = async (fileName, payload) => {
  const filePath = `database/${fileName}.json`

  const result = new Promise((reslove, reject) => {
    const errorReject = (err) => errorUtils.errorHandler(err, reject)

    fs.readFile(filePath, jsonFileType, (err, oldData) => {
      // Case don't have file or first create file
      if (err) {
        const data = [payload]
        fs.writeFile(filePath, JSON.stringify(data), jsonFileType, errorReject)
        reslove(payload)

        return
      }

      oldData = JSON.parse(oldData)
      oldData.push(payload)
      json = JSON.stringify(oldData)
      fs.writeFile(filePath, JSON.stringify(oldData), jsonFileType, errorReject)
      reslove(payload)
    })
  })

  return result
}

module.exports = {
  create,
}
